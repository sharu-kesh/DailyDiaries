#!/bin/bash

echo "Starting microservices..."

# Start user-service (Port 8081)
java -XX:+UseSerialGC -Xss256k -XX:TieredStopAtLevel=1 -Xms32m -Xmx64m -XX:CICompilerCount=2 -jar user-service.jar &

# Start blog-service (Port 8082)
java -XX:+UseSerialGC -Xss256k -XX:TieredStopAtLevel=1 -Xms32m -Xmx64m -XX:CICompilerCount=2 -jar blog-service.jar &

# Start reaction-service (Port 8083)
java -XX:+UseSerialGC -Xss256k -XX:TieredStopAtLevel=1 -Xms32m -Xmx48m -XX:CICompilerCount=2 -jar reaction-service.jar &

# Start comment-service (Port 8084)
java -XX:+UseSerialGC -Xss256k -XX:TieredStopAtLevel=1 -Xms32m -Xmx48m -XX:CICompilerCount=2 -jar comment-service.jar &

# Start feed-service (Port 8085)
java -XX:+UseSerialGC -Xss256k -XX:TieredStopAtLevel=1 -Xms32m -Xmx64m -XX:CICompilerCount=2 -jar feed-service.jar &

# Wait for 15 seconds to allow backend services to bootstrap
echo "Waiting for services to bootstrap..."
sleep 15

echo "Starting API Gateway on port ${PORT:-8080}..."
# Start api-gateway in the foreground using the dynamic port allocated by Render
java -XX:+UseSerialGC -Xss256k -XX:TieredStopAtLevel=1 -Xms48m -Xmx80m -XX:CICompilerCount=2 -jar api-gateway.jar --server.port=${PORT:-8080}
