package com.dailydiaries.controller;

import com.dailydiaries.entity.Comment;
import com.dailydiaries.service.CommentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2/comments")
public class CommentController {

    private static final Logger logger = LoggerFactory.getLogger(CommentController.class);

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public ResponseEntity<Comment> addComment(
            @RequestHeader("X-Auth-User-Id") Long userId,
            @RequestBody Comment comment) {
        logger.debug("Received POST /api/v2/comments for userId: {}, blogId: {}", userId, comment.getBlogId());
        comment.setUserId(userId);
        Comment savedComment = commentService.addComment(comment);
        return ResponseEntity.ok(savedComment);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Comment> getComment(
            @PathVariable Long id) {
        logger.debug("Received GET /api/v2/comments/{}", id);
        Comment comment = commentService.getCommentById(id);
        return ResponseEntity.ok(comment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(
            @RequestHeader("X-Auth-User-Id") Long userId,
            @PathVariable Long id) {
        logger.debug("Received DELETE /api/v2/comments/{} for userId: {}", id, userId);
        commentService.deleteComment(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/blog/{blogId}")
    public ResponseEntity<Page<Comment>> getCommentsByBlogId(
            @PathVariable Long blogId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        logger.debug("Received GET /api/v2/comments/blog/{}?page={}&size={}", blogId, page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> comments = commentService.getCommentsByBlogId(blogId, pageable);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/blog/{blogId}/getCommentsCount")
    public ResponseEntity<Long> getCommentsCount(
            @PathVariable Long blogId) {
        logger.debug("Received GET /blog/{}/getCommentsCount", blogId);
        Long commentCount = commentService.getCommentsCountByBlogId(blogId);
        return ResponseEntity.ok(commentCount);
    }
}