package com.dailydiaries.service;

import com.dailydiaries.entity.Blog;
import com.dailydiaries.entity.User;
import com.dailydiaries.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;
    private static final SecretKey SECRET_KEY = io.jsonwebtoken.security.Keys.hmacShaKeyFor(
            "your-very-long-secret-key-for-jwt-1234567890".getBytes());

    public UserService(UserRepository userRepository, JdbcTemplate jdbcTemplate, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(User user) {
        String email = user.getEmail();
        logger.debug("Registering user with email: {}", email);
        if (userRepository.findByEmail(email).isPresent()) {
            logger.warn("User with email {} already exists", email);
            throw new IllegalStateException("User already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        logger.info("User registered successfully: {}", email);
        return savedUser;
    }

    public User getUserByEmail(String email) {
        logger.debug("Fetching user with email: {}", email);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("User not found for email: {}", email);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
                });
    }

    public User getUserById(Long id) {
        logger.debug("Fetching user with id: {}", id);
        return userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("User not found for id: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
                });
    }

    public String authenticate(String email, String password) {
        logger.debug("Authenticating user with email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("User not found: {}", email);
                    return new IllegalStateException("Invalid credentials");
                });
        if (!passwordEncoder.matches(password, user.getPassword())) {
            logger.warn("Invalid password for user: {}", email);
            throw new IllegalStateException("Invalid credentials");
        }
        String token = Jwts.builder()
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24 hours
                .signWith(SECRET_KEY)
                .compact();
        logger.info("Token generated for user: {}", email);
        return token;
    }

    public User updateUser(Long id, User user, Long authUserId) {
        logger.debug("Updating user with id: {} for authUserId: {}", id, authUserId);
        if (!id.equals(authUserId)) {
            logger.warn("User {} is not authorized to update user {}", authUserId, id);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to update this user");
        }
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("User not found for id: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
                });
        existingUser.setUsername(user.getUsername());
        existingUser.setBio(user.getBio());
        return userRepository.save(existingUser);
    }

    public void saveBlog(Long userId, Long blogId) {
        logger.debug("Saving blog {} for user {}", blogId, userId);
        // Verify user exists
        if (!userRepository.existsById(userId)) {
            logger.warn("User not found for id: {}", userId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        // Verify blog exists (assumes Blog Service call or database check)
        String sql = "INSERT INTO saved_blogs (user_id, blog_id) VALUES (?, ?) ON CONFLICT DO NOTHING";
        int rows = jdbcTemplate.update(sql, userId, blogId);
        if (rows == 0) {
            logger.warn("Blog {} already saved or does not exist for user {}", blogId, userId);
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Blog already saved or does not exist");
        }
        logger.info("Blog {} saved for user {}", blogId, userId);
    }

    public Page<BlogResponse> getSavedBlogs(Long userId, Pageable pageable) {
        logger.debug("Fetching saved blogs for user {}", userId);
        if (!userRepository.existsById(userId)) {
            logger.warn("User not found for id: {}", userId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        String sql_saved_blogs = "SELECT id, content, created_at, like_count, subtitle, title, title_image, user_id\n" +
                "\tFROM (SELECT blog_id from saved_blogs where user_id=?) as saved_blogs_for_blog_id JOIN blogs on id = blog_id ORDER BY created_at DESC; LIMIT ? OFFSET ?";
        List<Blog> blogs = jdbcTemplate.queryForList(
                sql_saved_blogs,
                new Object[]{userId, pageable.getPageSize(), pageable.getOffset()},
                Blog.class
        );
        String sql_user_name = "SELECT username FROM users WHERE id = ?";
        List<BlogResponse> blogResponses = blogs.stream()
                .map(blog -> {
                    String user = jdbcTemplate.queryForObject(
                            sql_user_name,
                            String.class
                    );
                    String username = user != null ? user: "Unknown";
                    return new BlogResponse(
                            blog.getId(),
                            blog.getTitle(),
                            blog.getSubtitle(),
                            blog.getTitleImage(),
                            blog.getContent(),
                            blog.getUserId(),
                            username,
                            blog.getCreatedAt(),
                            blog.getLikeCount()
                    );
                })
                .collect(Collectors.toList());
        String countSql = "SELECT COUNT(*) FROM saved_blogs WHERE user_id = ?";
        Long total = jdbcTemplate.queryForObject(countSql, new Object[]{userId}, Long.class);
        return new PageImpl<>(blogResponses, pageable, total != null ? total : 0);
    }
}