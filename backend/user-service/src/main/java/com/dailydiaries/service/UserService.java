package com.dailydiaries.service;

import com.dailydiaries.entity.Blog;
import com.dailydiaries.entity.LoginDTO;
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

    public LoginDTO authenticate(String email, String password) {
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
                .setExpiration(new Date(System.currentTimeMillis() + 2592000000L)) // 30 days
                .signWith(SECRET_KEY)
                .compact();
        logger.info("Token generated for user: {}", email);
        return new LoginDTO(user.getId(), user.getUsername(), user.getBio(), token);
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

        // Corrected SQL query with proper parameter binding
        String sql_saved_blogs = """
            SELECT b.id, b.content, b.created_at, b.like_count, b.subtitle, b.title, b.title_image, b.user_id, u.username
            FROM saved_blogs sb
            JOIN blogs b ON b.id = sb.blog_id
            JOIN users u ON b.user_id = u.id
            WHERE sb.user_id = ?
            ORDER BY b.created_at DESC
            LIMIT ? OFFSET ?
        """;

        // Use query with RowMapper for proper object mapping
        List<BlogResponse> blogResponses = jdbcTemplate.query(
                sql_saved_blogs,
                new Object[]{userId, pageable.getPageSize(), pageable.getOffset()},
                (rs, rowNum) -> new BlogResponse(
                        rs.getLong("id"),
                        rs.getString("title"),
                        rs.getString("subtitle"),
                        rs.getString("title_image"),
                        rs.getString("content"),
                        rs.getLong("user_id"),
                        rs.getString("username"),
                        rs.getTimestamp("created_at").toLocalDateTime(),
                        rs.getLong("like_count")
                )
        );

        // Count query for total elements
        String countSql = "SELECT COUNT(*) FROM saved_blogs WHERE user_id = ?";
        Long total = jdbcTemplate.queryForObject(countSql, new Object[]{userId}, Long.class);

        return new PageImpl<>(blogResponses, pageable, total != null ? total : 0);
    }
}