package com.dailydiaries.config;

import com.dailydiaries.filter.JwtAuthenticationFilter;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class GatewayConfig {

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }

    @Bean
    public GlobalFilter jwtAuthenticationGlobalFilter(JwtAuthenticationFilter jwtAuthenticationFilter) {
        return (exchange, chain) -> jwtAuthenticationFilter.filter(exchange, chain);
    }
}