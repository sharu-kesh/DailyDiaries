package com.dailydiaries.entity;

import lombok.Data;

import java.util.List;

@Data
public class BlogPageResponse {
    private List<Blog> content;
    private int pageNumber;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean last;
}