package com.dailydiaries.controller;

import com.dailydiaries.entity.Blog;
import com.dailydiaries.service.BlogResponse;
import com.dailydiaries.service.BlogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v2/blogs")
public class BlogController {

    private static final Logger logger = LoggerFactory.getLogger(BlogController.class);

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @PostMapping
    public ResponseEntity<Blog> createBlog(
            @RequestHeader("X-Auth-User-Id") Long userId,
            @RequestBody Blog blog) {
        logger.debug("Received POST /api/v2/blogs for userId: {}", userId);
        Blog createdBlog = blogService.createBlog(blog, userId);
        return ResponseEntity.ok(createdBlog);
    }

    @GetMapping
    public ResponseEntity<Page<BlogResponse>> getBlogsByUserIds(
            @RequestParam String userIds,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        logger.debug("Received GET /api/v2/blogs?userIds={}&page={}&size={}", userIds, page, size);
        List<Long> userIdList = Arrays.stream(userIds.split(","))
                .map(Long::parseLong)
                .collect(Collectors.toList());
        Pageable pageable = PageRequest.of(page, size);
        Page<BlogResponse> blogs = blogService.getBlogsByUserIds(userIdList, pageable);
        return ResponseEntity.ok(blogs);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlog(
            @RequestHeader("X-Auth-User-Id") Long userId,
            @PathVariable Long id) {
        logger.debug("Received DELETE /api/v2/blogs/{} for userId: {}", id, userId);
        blogService.deleteBlog(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}/getBlogsCount")
    public ResponseEntity<Long> getBlogsCount(
            @PathVariable Long userId) {
        logger.debug("Received GET /{}/getBlogsCount", userId);
        Long commentCount = blogService.getBlogCountByUserId(userId);
        return ResponseEntity.ok(commentCount);
    }
}