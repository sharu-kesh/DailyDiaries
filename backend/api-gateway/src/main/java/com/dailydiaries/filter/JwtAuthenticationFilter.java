package com.dailydiaries.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.util.Objects;

@Component
public class JwtAuthenticationFilter implements GatewayFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private static final SecretKey SECRET_KEY = io.jsonwebtoken.security.Keys.hmacShaKeyFor(
            "your-very-long-secret-key-for-jwt-1234567890".getBytes());

    private final WebClient webClient;

    public JwtAuthenticationFilter(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://localhost:8081").build();
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        String path = exchange.getRequest().getURI().getPath();
        logger.debug("Processing request for path: {}", path);

        // Allow public endpoints
        if (path.equals("/api/v2/users/register") || path.equals("/api/v2/users/token")) {
            logger.debug("Allowing unauthenticated access to {}", path);
            return chain.filter(exchange);
        }

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("Missing or invalid Authorization header for path: {}", path);
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            String username = claims.getSubject();
            logger.debug("JWT validated for user: {}", username);

            return getUserIdByEmail(username)
                    .flatMap(user -> {
                        if (user == null || user.getId() == null) {
                            logger.warn("User ID not found for email: {}", username);
                            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                            return exchange.getResponse().setComplete();
                        }
                        logger.debug("Setting headers: X-Auth-User={}, X-Auth-User-Id={}", username, user.getId());
                        exchange.getRequest().mutate()
                                .header("X-Auth-User", username)
                                .header("X-Auth-User-Id", user.getId().toString())
                                .build();
                        return chain.filter(exchange);
                    })
                    .onErrorResume(e -> {
                        logger.error("Failed to fetch user ID for email: {}. Error: {}", username, e.getMessage());
                        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                        return exchange.getResponse().setComplete();
                    });
        } catch (Exception e) {
            logger.error("JWT validation failed for token: {}. Error: {}", token, e.getMessage());
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
    }

    private Mono<User> getUserIdByEmail(String email) {
        logger.debug("Fetching user ID from User Service for email: {}", email);
        return webClient.get()
                .uri("/api/v2/users/email/{email}", email)
                .retrieve()
                .bodyToMono(User.class)
                .doOnNext(user -> logger.debug("User ID {} found for email: {}", user.getId(), email))
                .onErrorResume(e -> {
                    logger.error("Failed to fetch user ID for email: {}. Error: {}", email, e.getMessage());
                    return Mono.empty();
                });
    }

    private static class User {
        private Long id;
        private String email;
        private String bio;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getBio() {
            return bio;
        }

        public void setBio(String bio) {
            this.bio = bio;
        }
    }
}