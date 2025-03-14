#!/bin/bash

# Start MongoDB
echo "Starting MongoDB container..."
docker run -d --name petit-mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:latest

# Start Redis
echo "Starting Redis container..."
docker run -d --name petit-redis \
  -p 6379:6379 \
  redis:alpine

echo "Databases started. You can connect to:"
echo "MongoDB: mongodb://admin:password@localhost:27017/petit-url?authSource=admin"
echo "Redis: localhost:6379"
