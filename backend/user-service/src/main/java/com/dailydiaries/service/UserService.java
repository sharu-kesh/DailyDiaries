package com.dailydiaries.service;

import com.dailydiaries.entity.User;
import com.dailydiaries.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private static final SecretKey SECRET_KEY = io.jsonwebtoken.security.Keys.hmacShaKeyFor(
            "your-very-long-secret-key-for-jwt-1234567890".getBytes());

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(String email, String password, String bio) {
        logger.debug("Registering user with email: {}", email);
        if (userRepository.findByEmail(email).isPresent()) {
            logger.warn("User with email {} already exists", email);
            throw new IllegalStateException("User already exists");
        }
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setBio(bio);
        User savedUser = userRepository.save(user);
        logger.info("User registered successfully: {}", email);
        return savedUser;
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

    public User findByEmail(String email) {
        logger.debug("Fetching user by email: {}", email);
        return userRepository.findByEmail(email).orElse(null);
    }
}