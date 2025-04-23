package com.dailydiaries.controller;

import com.dailydiaries.entity.BlogResponse;
import com.dailydiaries.service.FeedService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2/feed")
public class FeedController {

    private static final Logger logger = LoggerFactory.getLogger(FeedController.class);

    private final FeedService feedService;

    public FeedController(FeedService feedService) {
        this.feedService = feedService;
    }

    @GetMapping
    public ResponseEntity<Page<BlogResponse>> getFeed(
            @RequestHeader("X-Auth-User-Id") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        logger.debug("Received GET /api/v2/feed for userId: {}, page: {}, size: {}", userId, page, size);
        Page<BlogResponse> feed = feedService.getFeed(userId, page, size, userId.toString());
        return ResponseEntity.ok(feed);
    }

    @PostMapping("/{followedId}/follow")
    public ResponseEntity<Void> follow(
            @RequestHeader("X-Auth-User-Id") Long followerId,
            @PathVariable Long followedId) {
        logger.debug("Received POST /api/v2/feed/{}/follow for followerId: {}", followedId, followerId);
        feedService.follow(followerId, followedId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{followedId}/unfollow")
    public ResponseEntity<Void> unfollow(
            @RequestHeader("X-Auth-User-Id") Long followerId,
            @PathVariable Long followedId) {
        logger.debug("Received POST /api/v2/feed/{}/unfollow for followerId: {}", followedId, followerId);
        feedService.unfollow(followerId, followedId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getFollowers")
    public ResponseEntity<Long> getFollowers(
            @RequestHeader("X-Auth-User-Id") Long userId) {
        logger.debug("Received GET /getFollowers for userId: {}", userId);
        Long followersCount = feedService.getFollowersCount(userId);
        return ResponseEntity.ok(followersCount);
    }

    @GetMapping("/getFollowings")
    public ResponseEntity<Long> getFollowings(
            @RequestHeader("X-Auth-User-Id") Long userId) {
        logger.debug("Received GET /getFollowings for userId: {}", userId);
        Long followingsCount = feedService.getFollowingCount(userId);
        return ResponseEntity.ok(followingsCount);
    }
}