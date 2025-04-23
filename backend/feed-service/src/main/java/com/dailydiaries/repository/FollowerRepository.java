package com.dailydiaries.repository;

import com.dailydiaries.entity.Follower;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FollowerRepository extends JpaRepository<Follower, Long> {
    List<Follower> findByFollowerId(Long followerId);
    boolean existsByFollowerIdAndFollowedId(Long followerId, Long followedId);
    Optional<Follower> findByFollowerIdAndFollowedId(Long followerId, Long followedId);
    long countByFollowedId(Long followedId); // for our followers
    long countByFollowerId(Long followerId); // for our following
}