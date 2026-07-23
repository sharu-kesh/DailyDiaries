#!/bin/bash

echo "Starting API Gateway on port 8080..."
# Start api-gateway in the background on port 8080 (matching Dockerfile EXPOSE)
# Starting it first allows Render to detect the open port 8080 immediately and mark deployment as Live
java -Xint -XX:+UseSerialGC -Xss256k -XX:MaxMetaspaceSize=40m -Xms24m -Xmx48m -jar api-gateway.jar &
sleep 5

# Start user-service (Port 8081)
java -Xint -XX:+UseSerialGC -Xss256k -XX:MaxMetaspaceSize=35m -Xms20m -Xmx32m -jar user-service.jar &
echo "User Service starting..."
sleep 5

# Start blog-service (Port 8082)
java -Xint -XX:+UseSerialGC -Xss256k -XX:MaxMetaspaceSize=35m -Xms20m -Xmx32m -jar blog-service.jar &
echo "Blog Service starting..."
sleep 5

# Start reaction-service (Port 8083)
java -Xint -XX:+UseSerialGC -Xss256k -XX:MaxMetaspaceSize=30m -Xms16m -Xmx24m -jar reaction-service.jar &
echo "Reaction Service starting..."
sleep 5

# Start comment-service (Port 8084)
java -Xint -XX:+UseSerialGC -Xss256k -XX:MaxMetaspaceSize=30m -Xms16m -Xmx24m -jar comment-service.jar &
echo "Comment Service starting..."
sleep 5

# Start feed-service (Port 8085)
java -Xint -XX:+UseSerialGC -Xss256k -XX:MaxMetaspaceSize=35m -Xms20m -Xmx32m -jar feed-service.jar &
echo "Feed Service starting..."

# Keep container running by waiting on all background processes
echo "All microservices launched in the background. Waiting..."
wait
