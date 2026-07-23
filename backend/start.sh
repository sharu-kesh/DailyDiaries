#!/bin/bash

echo "Starting microservices..."

# Start user-service (Port 8081)
java -XX:TieredStopAtLevel=1 -Xmx192m -jar user-service.jar &

# Start blog-service (Port 8082)
java -XX:TieredStopAtLevel=1 -Xmx192m -jar blog-service.jar &

# Start reaction-service (Port 8083)
java -XX:TieredStopAtLevel=1 -Xmx192m -jar reaction-service.jar &

# Start comment-service (Port 8084)
java -XX:TieredStopAtLevel=1 -Xmx192m -jar comment-service.jar &

# Start feed-service (Port 8085)
java -XX:TieredStopAtLevel=1 -Xmx192m -jar feed-service.jar &

# Wait for 15 seconds to allow backend services to bootstrap
echo "Waiting for services to bootstrap..."
sleep 15

echo "Starting API Gateway on port 7860..."
# Start api-gateway in the foreground (Port 7860) to keep container alive
java -XX:TieredStopAtLevel=1 -Xmx256m -jar api-gateway.jar --server.port=7860
