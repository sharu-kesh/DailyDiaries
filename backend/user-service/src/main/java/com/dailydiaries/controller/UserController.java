package com.dailydiaries.controller;

import com.dailydiaries.entity.User;
import com.dailydiaries.service.BlogResponse;
import com.dailydiaries.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v2/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        logger.debug("Received POST /api/v2/users/register for email: {}", user.getEmail());
        User registeredUser = userService.register(user);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/token")
    public ResponseEntity<String> loginUser(@RequestBody User user) {
        logger.debug("Received POST /api/v2/users/token for email: {}", user.getEmail());
        String token = userService.authenticate(user.getEmail(), user.getPassword());
        return ResponseEntity.ok(token);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        logger.debug("Received GET /api/v2/users/email/{}", email);
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        logger.debug("Received GET /api/v2/users/{}", id);
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestHeader("X-Auth-User-Id") Long authUserId,
            @RequestBody User user) {
        logger.debug("Received PUT /api/v2/users/{} for authUserId: {}", id, authUserId);
        User updatedUser = userService.updateUser(id, user, authUserId);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/{userId}/saved-blogs")
    public ResponseEntity<Void> saveBlog(
            @PathVariable Long userId,
            @RequestHeader("X-Auth-User-Id") Long authUserId,
            @RequestBody BlogIdRequest blogIdRequest) {
        logger.debug("Received POST /api/v2/users/{}/saved-blogs for authUserId: {}", userId, authUserId);
        if (!userId.equals(authUserId)) {
            logger.warn("User {} is not authorized to save blogs for user {}", authUserId, userId);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }
        userService.saveBlog(userId, blogIdRequest.getBlogId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}/saved-blogs")
    public ResponseEntity<Page<BlogResponse>> getSavedBlogs(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        logger.debug("Received GET /api/v2/users/{}/saved-blogs?page={}&size={}", userId, page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<BlogResponse> savedBlogs = userService.getSavedBlogs(userId, pageable);
        return ResponseEntity.ok(savedBlogs);
    }
}

class BlogIdRequest {
    private Long blogId;

    public Long getBlogId() {
        return blogId;
    }

    public void setBlogId(Long blogId) {
        this.blogId = blogId;
    }
}