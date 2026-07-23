# Stage 1: Build the Maven packages
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app
COPY . .
# Compile and package all 6 microservices
RUN mvn clean package -DskipTests

# Stage 2: Runtime environment
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy the built JAR files from the builder stage
COPY --from=builder /app/api-gateway/target/*.jar api-gateway.jar
COPY --from=builder /app/user-service/target/*.jar user-service.jar
COPY --from=builder /app/blog-service/target/*.jar blog-service.jar
COPY --from=builder /app/reaction-service/target/*.jar reaction-service.jar
COPY --from=builder /app/comment-service/target/*.jar comment-service.jar
COPY --from=builder /app/feed-service/target/*.jar feed-service.jar

# Copy and configure the startup script
COPY start.sh start.sh
RUN chmod +x start.sh

# Hugging Face Spaces expects the container to expose port 7860
EXPOSE 7860

# Run all services
ENTRYPOINT ["./start.sh"]
