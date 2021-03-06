#!/bin/bash -eux

# Remove old images
docker system prune -a -f
docker rm $(docker ps -q -f 'status=exited') || echo 'Failed to remove old containers, maybe there was nothing to do'
docker rmi $(docker images -q -f "dangling=true") || echo 'Failed to remove old images, maybe there was nothing to do'

# Build a Docker image
docker-compose build --no-cache

# Restart using the new image
docker-compose up -d --scale registry=5
