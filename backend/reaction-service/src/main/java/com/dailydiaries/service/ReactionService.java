package com.dailydiaries.service;

import com.dailydiaries.entity.Reaction;
import com.dailydiaries.repository.ReactionRepository;
import org.springframework.stereotype.Service;

@Service
public class ReactionService {

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
}