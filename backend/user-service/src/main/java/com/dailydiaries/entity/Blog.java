package com.dailydiaries.entity;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
public class Blog {
    private Long id;

    private String title;

    private String subtitle;

    private String titleImage;

    private String content;

    private Long userId;

    private LocalDateTime createdAt;

    private Long likeCount;
}