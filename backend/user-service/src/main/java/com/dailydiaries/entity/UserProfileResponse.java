package com.dailydiaries.entity;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String username;
    private String bio;
    private Long blogsCount;
    private Long followersCount;
    private Long followingsCount;
}