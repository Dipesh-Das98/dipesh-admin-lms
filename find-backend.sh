#!/bin/bash

echo "=== Finding Docker Backend Information ==="
echo ""

echo "1. Current running containers:"
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Networks}}"
echo ""

echo "2. Available Docker networks:"
docker network ls
echo ""

echo "3. Looking for containers with port 8080:"
docker ps --filter "publish=8080" --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}"
echo ""

echo "=== Instructions ==="
echo "1. Find your backend container name from the list above"
echo "2. Find the network your backend is using"
echo "3. Update .env.docker with: BACKEND_API_URL=http://YOUR_BACKEND_CONTAINER_NAME:8080"
echo "4. Update docker-compose.yml external network name if needed"
echo ""

echo "Example commands to inspect a specific container:"
echo "docker inspect CONTAINER_NAME | grep NetworkMode"
echo "docker inspect CONTAINER_NAME | grep Networks -A 10"
