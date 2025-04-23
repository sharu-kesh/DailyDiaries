package com.dailydiaries.repository;

import com.dailydiaries.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByBlogId(Long blogId, Pageable pageable);
    Long countByBlogId(Long blogId);
}