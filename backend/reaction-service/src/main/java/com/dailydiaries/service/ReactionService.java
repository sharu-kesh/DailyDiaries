package com.dailydiaries.service;

import com.dailydiaries.entity.Reaction;
import com.dailydiaries.repository.ReactionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ReactionService {

    private static final Logger logger = LoggerFactory.getLogger(ReactionService.class);

    private final ReactionRepository reactionRepository;

    public ReactionService(ReactionRepository reactionRepository) {
        this.reactionRepository = reactionRepository;
    }

    public Reaction addReaction(Long userId, Long blogId, String type) {
        Reaction reaction = new Reaction();
        reaction.setUserId(userId);
        reaction.setBlogId(blogId);
        reaction.setType(type);
        return reactionRepository.save(reaction);
    }

    public long getLikeCount(Long blogId) {
        logger.debug("Fetching like count for blogId: {}", blogId);
        return reactionRepository.countByBlogIdAndType(blogId, "like");
    }

    public void deleteReaction(Long blogId, Long userId, String type) {
        logger.debug("Deleting reaction for blogId: {}, userId: {}, type: {}", blogId, userId, type);
        Reaction reaction = reactionRepository.findByBlogIdAndUserIdAndType(blogId, userId, type)
                .orElseThrow(() -> {
                    logger.warn("Reaction not found for blogId: {}, userId: {}, type: {}", blogId, userId, type);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Reaction not found");
                });
        reactionRepository.delete(reaction);
        logger.info("Reaction deleted for blogId: {}, userId: {}, type: {}", blogId, userId, type);
    }
}