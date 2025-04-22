package com.dailydiaries.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "comments")
@Data
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "blog_id")
    private Long blogId;
    @Column(name = "user_id")
    private Long userId;
    private String content;
}