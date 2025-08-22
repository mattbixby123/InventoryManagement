FROM nginx:alpine

# Set proper permissions for log directory
RUN chmod 755 /var/log/nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]