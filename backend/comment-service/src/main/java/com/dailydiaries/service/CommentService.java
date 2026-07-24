package com.dailydiaries.service;

import com.dailydiaries.entity.Comment;
import com.dailydiaries.entity.User;
import com.dailydiaries.repository.CommentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class CommentService {

    private static final Logger logger = LoggerFactory.getLogger(CommentService.class);

    private final CommentRepository commentRepository;
    private final RestTemplate restTemplate;

    public CommentService(CommentRepository commentRepository, RestTemplate restTemplate) {
        this.commentRepository = commentRepository;
        this.restTemplate = restTemplate;
    }

    public Comment addComment(Comment comment) {
        logger.debug("Adding comment for blogId: {}, userId: {}", comment.getBlogId(), comment.getUserId());
        if (comment.getBlogId() == null || comment.getUserId() == null || comment.getContent() == null) {
            logger.warn("Invalid comment data: blogId={}, userId={}, content={}",
                    comment.getBlogId(), comment.getUserId(), comment.getContent());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid comment data");
        }
        comment.setCreatedAt(LocalDateTime.now());
        Comment savedComment = commentRepository.save(comment);
        populateUsername(savedComment);
        return savedComment;
    }

    public Comment getCommentById(Long id) {
        logger.debug("Fetching comment with id: {}", id);
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Comment not found for id: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found");
                });
        populateUsername(comment);
        return comment;
    }

    public void deleteComment(Long id, Long userId) {
        logger.debug("Deleting comment with id: {} for userId: {}", id, userId);
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Comment not found for id: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found");
                });

        if (!comment.getUserId().equals(userId)) {
            logger.warn("User {} is not authorized to delete comment {}", userId, id);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to delete this comment");
        }

        commentRepository.delete(comment);
        logger.info("Comment {} deleted successfully", id);
    }

    public Page<Comment> getCommentsByBlogId(Long blogId, Pageable pageable) {
        logger.debug("Fetching comments for blogId: {}", blogId);
        Page<Comment> comments = commentRepository.findByBlogId(blogId, pageable);
        comments.getContent().forEach(this::populateUsername);
        return comments;
    }

    public long getCommentsCountByBlogId(Long blogId) {
        logger.debug("Fetching Comments count for BlogId: {}", blogId);
        return commentRepository.countByBlogId(blogId);
    }

    private void populateUsername(Comment comment) {
        try {
            User user = restTemplate.getForObject(
                    "http://localhost:8081/api/v2/users/" + comment.getUserId(),
                    User.class
            );
            if (user != null && user.getUsername() != null) {
                comment.setUsername(user.getUsername());
            } else {
                comment.setUsername("Unknown");
            }
        } catch (Exception e) {
            logger.warn("Failed to fetch username for userId: {}", comment.getUserId(), e);
            comment.setUsername("Unknown");
        }
    }
}