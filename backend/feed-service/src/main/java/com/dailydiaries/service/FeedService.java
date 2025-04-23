package com.dailydiaries.service;

import com.dailydiaries.entity.BlogPageResponse;
import com.dailydiaries.entity.BlogResponse;
import com.dailydiaries.entity.Follower;
import com.dailydiaries.repository.FollowerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedService {

    private static final Logger logger = LoggerFactory.getLogger(FeedService.class);

    private final FollowerRepository followerRepository;
    private final RestTemplate restTemplate;

    @Value("${blog.service.url:http://localhost:8082}")
    private String blogServiceUrl;

    public FeedService(FollowerRepository followerRepository, RestTemplate restTemplate) {
        this.followerRepository = followerRepository;
        this.restTemplate = restTemplate;
    }

    public Page<BlogResponse> getFeed(Long userId, int page, int size, String authUserId) {
        logger.debug("Fetching feed for userId: {}, page: {}, size: {}", userId, page, size);

        // Fetch followed user IDs
        List<Follower> followers = followerRepository.findByFollowerId(userId);
        List<Long> followedIds = followers.stream()
                .map(Follower::getFollowedId)
                .collect(Collectors.toList());

        if (followedIds.isEmpty()) {
            logger.debug("No followed users found for userId: {}", userId);
            return new PageImpl<>(Collections.emptyList(), PageRequest.of(page, size), 0);
        }

        // Call Blog Service with userIds and headers
        String userIds = followedIds.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(","));
        String url = blogServiceUrl + "/api/v2/blogs?userIds=" + userIds + "&page=" + page + "&size=" + size;
        logger.debug("Calling Blog Service: {}", url);

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Auth-User-Id", authUserId);
        HttpEntity<?> entity = new HttpEntity<>(headers);

        try {
            BlogPageResponse response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<BlogPageResponse>() {}
            ).getBody();

            logger.debug("Blog Service response: {}", response);
            logger.debug("Retrieved {} blogs from Blog Service", response != null && response.getContent() != null ? response.getContent().size() : 0);

            if (response == null || response.getContent() == null) {
                return new PageImpl<>(Collections.emptyList(), PageRequest.of(page, size), 0);
            }

            // Validate pageSize
            int validPageSize = response.getPageSize() > 0 ? response.getPageSize() : size;
            int validPageNumber = response.getPageNumber() >= 0 ? response.getPageNumber() : page;

            return new PageImpl<>(
                    response.getContent(),
                    PageRequest.of(validPageNumber, validPageSize),
                    response.getTotalElements()
            );
        } catch (HttpClientErrorException e) {
            logger.error("Blog Service returned error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new ResponseStatusException(e.getStatusCode(), "Failed to fetch blogs: " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            logger.error("Unexpected error while fetching blogs: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch blogs", e);
        }
    }

    public void follow(Long followerId, Long followedId) {
        logger.debug("User {} attempting to follow user {}", followerId, followedId);

        if (followerId.equals(followedId)) {
            logger.warn("User {} cannot follow themselves", followerId);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot follow yourself");
        }

        boolean alreadyFollowing = followerRepository.existsByFollowerIdAndFollowedId(followerId, followedId);
        if (alreadyFollowing) {
            logger.warn("User {} is already following user {}", followerId, followedId);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Already following this user");
        }

        Follower follower = new Follower();
        follower.setFollowerId(followerId);
        follower.setFollowedId(followedId);
        followerRepository.save(follower);
        logger.info("User {} successfully followed user {}", followerId, followedId);
    }

    public void unfollow(Long followerId, Long followedId) {
        logger.debug("User {} attempting to unfollow user {}", followerId, followedId);

        if (followerId.equals(followedId)) {
            logger.warn("User {} cannot unfollow themselves", followerId);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot unfollow yourself");
        }

        Follower follower = followerRepository.findByFollowerIdAndFollowedId(followerId, followedId)
                .orElseThrow(() -> {
                    logger.warn("User {} is not following user {}", followerId, followedId);
                    return new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not following this user");
                });

        followerRepository.delete(follower);
        logger.info("User {} successfully unfollowed user {}", followerId, followedId);
    }

    public long getFollowingCount(Long userId) {
        logger.debug("Fetching following count for user: {}", userId);
        return followerRepository.countByFollowerId(userId);
    }

    public long getFollowersCount(Long userId) {
        logger.debug("Fetching followers count for user: {}", userId);
        return followerRepository.countByFollowedId(userId);
    }
}
