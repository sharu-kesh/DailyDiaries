package com.dailydiaries.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class User {
    private Long id;

    private String email;

    private String password;

    private String username;

    private String bio;
}