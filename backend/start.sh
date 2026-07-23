#!/bin/bash

echo "Starting microservices..."

# Start user-service (Port 8081)
java -XX:TieredStopAtLevel=1 -XX:+UseSerialGC -Xss256k -XX:ReservedCodeCacheSize=12m -XX:CICompilerCount=1 -XX:MaxMetaspaceSize=35m -Xms24m -Xmx32m -jar user-service.jar &

# Start blog-service (Port 8082)
java -XX:TieredStopAtLevel=1 -XX:+UseSerialGC -Xss256k -XX:ReservedCodeCacheSize=12m -XX:CICompilerCount=1 -XX:MaxMetaspaceSize=35m -Xms24m -Xmx32m -jar blog-service.jar &

# Start reaction-service (Port 8083)
java -XX:TieredStopAtLevel=1 -XX:+UseSerialGC -Xss256k -XX:ReservedCodeCacheSize=12m -XX:CICompilerCount=1 -XX:MaxMetaspaceSize=30m -Xms16m -Xmx24m -jar reaction-service.jar &

# Start comment-service (Port 8084)
java -XX:TieredStopAtLevel=1 -XX:+UseSerialGC -Xss256k -XX:ReservedCodeCacheSize=12m -XX:CICompilerCount=1 -XX:MaxMetaspaceSize=30m -Xms16m -Xmx24m -jar comment-service.jar &

# Start feed-service (Port 8085)
java -XX:TieredStopAtLevel=1 -XX:+UseSerialGC -Xss256k -XX:ReservedCodeCacheSize=12m -XX:CICompilerCount=1 -XX:MaxMetaspaceSize=35m -Xms24m -Xmx32m -jar feed-service.jar &

# Wait for 15 seconds to allow backend services to bootstrap
echo "Waiting for services to bootstrap..."
sleep 15

echo "Starting API Gateway on port ${PORT:-8080}..."
# Start api-gateway in the foreground using the dynamic port allocated by Render
java -XX:TieredStopAtLevel=1 -XX:+UseSerialGC -Xss256k -XX:ReservedCodeCacheSize=16m -XX:CICompilerCount=1 -XX:MaxMetaspaceSize=40m -Xms32m -Xmx48m -jar api-gateway.jar --server.port=${PORT:-8080}
