package com.dailydiaries.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "reactions")
@Data
public class Reaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "blog_id")
    private Long blogId;

    private String type;
}