FROM nginx:alpine

# Install netcat for healthchecks
RUN apk add --no-cache netcat-openbsd

# Set proper permissions for log directory
RUN chmod 755 /var/log/nginx

COPY nginx.vps.conf /etc/nginx/nginx.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
