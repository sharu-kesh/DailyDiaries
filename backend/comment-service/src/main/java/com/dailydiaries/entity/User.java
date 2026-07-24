package com.dailydiaries.entity;

import lombok.Data;

@Data
public class User {
    private Long id;
    private String email;
    private String username;
    private String bio;
}
