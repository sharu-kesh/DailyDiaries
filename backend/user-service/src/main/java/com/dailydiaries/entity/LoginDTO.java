package com.dailydiaries.entity;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginDTO {
    Long userId;
    String userName;
    String bio;
    String token;
}
