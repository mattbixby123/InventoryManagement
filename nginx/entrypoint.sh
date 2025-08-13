#!/bin/sh
# custom entrypoint script for ngnix
until nc -z frontend 3000; do
  echo "Waiting for frontend..."
  sleep 2
done

until nc -z backend 8000; do
  echo "Waiting for backend..."
  sleep 2
done

exec nginx -g 'daemon off;'