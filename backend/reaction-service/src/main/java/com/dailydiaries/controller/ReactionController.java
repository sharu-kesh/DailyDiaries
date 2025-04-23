package com.dailydiaries.controller;

import com.dailydiaries.entity.Reaction;
import com.dailydiaries.service.ReactionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2/reactions")
public class ReactionController {

    private static final Logger logger = LoggerFactory.getLogger(ReactionController.class);

    private final ReactionService reactionService;

    public ReactionController(ReactionService reactionService) {
        this.reactionService = reactionService;
    }

    @PostMapping
    public ResponseEntity<Reaction> addReaction(
            @RequestBody ReactionRequest request,
            @RequestHeader("X-Auth-User-Id") Long userId) {
        logger.debug("Adding reaction for userId: {}, blogId: {}, type: {}", userId, request.blogId(), request.type());
        Reaction reaction = reactionService.addReaction(userId, request.blogId(), request.type());
        return ResponseEntity.ok(reaction);
    }

    @GetMapping("/blog/{blogId}/like-count")
    public ResponseEntity<Long> getLikeCount(@PathVariable Long blogId) {
        logger.debug("Received GET /api/v2/reactions/blog/{}/like-count", blogId);
        long likeCount = reactionService.getLikeCount(blogId);
        return ResponseEntity.ok(likeCount);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteReaction(
            @RequestParam Long blogId,
            @RequestParam String type,
            @RequestHeader("X-Auth-User-Id") Long userId) {
        logger.debug("Received DELETE /api/v2/reactions?blogId={}&type={}", blogId, type);
        reactionService.deleteReaction(blogId, userId, type);
        return ResponseEntity.ok().build();
    }

    record ReactionRequest(Long blogId, String type) {}
}