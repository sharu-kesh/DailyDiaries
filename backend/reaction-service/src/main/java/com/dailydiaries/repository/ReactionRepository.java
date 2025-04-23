package com.dailydiaries.repository;

import com.dailydiaries.entity.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    long countByBlogIdAndType(Long blogId, String type);
    Optional<Reaction> findByBlogIdAndUserIdAndType(Long blogId, Long userId, String type);
}