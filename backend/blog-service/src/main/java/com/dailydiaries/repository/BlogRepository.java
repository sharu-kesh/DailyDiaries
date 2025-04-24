package com.dailydiaries.repository;

import com.dailydiaries.entity.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlogRepository extends JpaRepository<Blog, Long> {
    Page<Blog> findByUserIdIn(List<Long> userIds, Pageable pageable);
    Long countByUserId(Long userId);
}