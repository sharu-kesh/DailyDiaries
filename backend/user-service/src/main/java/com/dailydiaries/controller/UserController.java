package com.dailydiaries.controller;

import com.dailydiaries.entity.User;
import com.dailydiaries.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody UserRequest request) {
        User user = userService.register(request.email(), request.password(), request.bio());
        return ResponseEntity.ok(user);
    }

    @PostMapping("/token")
    public ResponseEntity<String> getToken(@RequestBody LoginRequest request) {
        String token = userService.authenticate(request.email(), request.password());
        return ResponseEntity.ok(token);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User user = userService.findByEmail(email);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    record UserRequest(String email, String password, String bio) {}
    record LoginRequest(String email, String password) {}
}