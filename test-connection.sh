#!/bin/bash

echo "=== Testing Backend Connection ==="
echo ""

# Test if we can reach the backend from the host
echo "1. Testing backend from host machine:"
curl -f http://localhost:8080/health || echo "Backend health endpoint not reachable from host (this is normal if no /health endpoint exists)"
echo ""

# Rebuild and start the frontend
echo "2. Rebuilding frontend container with new network configuration..."
docker-compose down
docker-compose up --build -d

# Wait a moment for container to start
echo "3. Waiting for containers to start..."
sleep 10

# Test connection from within the frontend container
echo "4. Testing backend connection from frontend container:"
docker-compose exec lms-admin-panel sh -c "curl -f http://lms-blackend-api-1:8080/health || echo 'Backend connection test - adjust endpoint as needed'"

echo ""
echo "=== Configuration Summary ==="
echo "Frontend: http://localhost:3000"
echo "Backend: http://lms-blackend-api-1:8080 (internal Docker network)"
echo "Backend from host: http://localhost:8080"
echo ""
echo "If the connection test fails, check:"
echo "1. Backend container is running: docker ps | grep lms-blackend-api"
echo "2. Networks are connected: docker network inspect lms-blackend_lms-network"
echo "3. Backend has the correct endpoints"
