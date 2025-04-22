package com.dailydiaries.entity;

import lombok.Data;

@Data
public class Blog {
    private Long id;
    private String title;
    private String content;
    private Long userId;
}