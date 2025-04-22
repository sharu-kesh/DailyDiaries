package com.dailydiaries.controller;

import com.dailydiaries.entity.Blog;
import com.dailydiaries.service.BlogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/v2/blogs")
public class BlogController {

    private static final Logger logger = LoggerFactory.getLogger(BlogController.class);

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    public ResponseEntity<Page<Blog>> getBlogsByUserIds(
            @RequestParam("userIds") String userIds,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader("X-Auth-User-Id") String authUserId) {
        logger.debug("Received GET /api/v2/blogs?userIds={}&page={}&size={}", userIds, page, size);
        List<Long> userIdList = Arrays.stream(userIds.split(","))
                .map(Long::parseLong)
                .toList();
        Page<Blog> blogs = blogService.findBlogsByUserIds(userIdList, PageRequest.of(page, size));
        return ResponseEntity.ok(blogs);
    }

    @PostMapping
    public ResponseEntity<Blog> createBlog(
            @RequestBody BlogRequest blogRequest,
            @RequestHeader("X-Auth-User-Id") Long userId) {
        logger.debug("Creating blog for userId: {}", userId);
        Blog blog = blogService.createBlog(blogRequest.title(), blogRequest.content(), userId);
        return ResponseEntity.ok(blog);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlog(
            @RequestHeader("X-Auth-User-Id") Long userId,
            @PathVariable Long id) {
        logger.debug("Received DELETE /api/v2/blogs/{} for userId: {}", id, userId);
        blogService.deleteBlog(id, userId);
        return ResponseEntity.ok().build();
    }

    record BlogRequest(String title, String content) {}
}