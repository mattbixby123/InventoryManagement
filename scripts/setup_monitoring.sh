#!/bin/bash

# setup_monitoring.sh - Nginx Performance Monitoring Setup
# Run this script to set up performance monitoring for your nginx deployment

set -e  # Exit on any error

echo "=== Setting up Nginx Performance Monitoring ==="

# Create necessary directories
echo "Creating directories..."
mkdir -p logs
mkdir -p performance_data
mkdir -p scripts

# Make sure log directory has proper permissions
chmod 755 logs

# Check if nginx config has detailed logging format
echo "Checking nginx configuration..."
if grep -q "log_format detailed" nginx.conf; then
    echo "✓ Detailed log format found in nginx.conf"
else
    echo "❌ Detailed log format NOT found in nginx.conf"
    echo "Please add the detailed log format to your nginx.conf:"
    echo ""
    echo "log_format detailed '\$remote_addr - \$remote_user [\$time_local] '"
    echo "                   '\"\$request\" \$status \$bytes_sent '"
    echo "                   '\"\$http_referer\" \"\$http_user_agent\" '"
    echo "                   'rt=\$request_time uct=\"\$upstream_connect_time\" '"
    echo "                   'uht=\"\$upstream_header_time\" urt=\"\$upstream_response_time\"';"
    echo ""
    exit 1
fi

# Check if access_log is configured
if grep -q "access_log.*detailed" nginx.conf; then
    echo "✓ Detailed access logging configured"
else
    echo "❌ Detailed access logging NOT configured"
    echo "Please add this line to your server block in nginx.conf:"
    echo "access_log /var/log/nginx/detailed_access.log detailed;"
    exit 1
fi

# Check if docker-compose has log volume mounted
echo "Checking docker-compose configuration..."
if grep -q "logs:" docker-compose.yml; then
    echo "✓ Log volume appears to be configured"
else
    echo "⚠️  Warning: Make sure your docker-compose.yml has log volume mounted"
    echo "Example configuration:"
    echo ""
    echo "services:"
    echo "  nginx:"
    echo "    volumes:"
    echo "      - ./logs:/var/log/nginx"
    echo "      - ./nginx.conf:/etc/nginx/nginx.conf"
    echo ""
fi

# Make scripts executable
echo "Making scripts executable..."
chmod +x scripts/analyze_logs.sh 2>/dev/null || echo "analyze_logs.sh not found (create it next)"
chmod +x scripts/test_performance.sh 2>/dev/null || echo "test_performance.sh not found (create it next)"

# Create a simple curl timing format file
echo "Creating curl timing format..."
cat > scripts/curl-format.txt << 'EOF'
     time_namelookup:  %{time_namelookup}s\n
        time_connect:  %{time_connect}s\n
     time_appconnect:  %{time_appconnect}s\n
    time_pretransfer:  %{time_pretransfer}s\n
       time_redirect:  %{time_redirect}s\n
  time_starttransfer:  %{time_starttransfer}s\n
                     ----------\n
          time_total:  %{time_total}s\n
EOF

# Create baseline test file if it doesn't exist
if [ ! -f scripts/test_performance.sh ]; then
    echo "Creating basic performance test script..."
    cat > scripts/test_performance.sh << 'EOF'
#!/bin/bash
# Basic performance testing script
echo "=== Baseline Performance Test ==="
echo "Testing your live site..."

SITE_URL="https://buoy.ufixu.net:8443"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Dashboard load times:"
for i in {1..5}; do
    curl -w "@${SCRIPT_DIR}/curl-format.txt" -s -o /dev/null "${SITE_URL}/dashboard"
    sleep 1
done

echo "Inventory page load times:"
for i in {1..5}; do
    curl -w "@${SCRIPT_DIR}/curl-format.txt" -s -o /dev/null "${SITE_URL}/inventory"
    sleep 1
done
EOF
    chmod +x scripts/test_performance.sh
fi

echo ""
echo "✓ Monitoring setup complete!"
echo ""
echo "Next steps:"
echo "1. Restart your nginx container: docker-compose restart nginx"
echo "2. Run initial performance test: ./scripts/test_performance.sh"
echo "3. Check logs are being generated: ls -la logs/"
echo "4. Analyze current performance: ./scripts/analyze_logs.sh"
echo ""
echo "Your performance monitoring is ready!"