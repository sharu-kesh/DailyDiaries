package com.dailydiaries.entity;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class BlogResponse {
    private Long id;
    private String title;
    private String subtitle;
    private String titleImage;
    private String content;
    private Long userId;
    private String username;
    private LocalDateTime createdAt;
    private Long likeCount;

    public BlogResponse(Long id, String title, String subtitle, String titleImage, String content,
                        Long userId, String username, LocalDateTime createdAt, Long likeCount) {
        this.id = id;
        this.title = title;
        this.subtitle = subtitle;
        this.titleImage = titleImage;
        this.content = content;
        this.userId = userId;
        this.username = username;
        this.createdAt = createdAt;
        this.likeCount = likeCount;
    }
}