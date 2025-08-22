# On your VPS, create analyze_logs.sh
#!/bin/bash
echo "=== Nginx Performance Analysis ==="
echo "Average Response Times:"
tail -1000 /var/log/nginx/detailed_access.log | \
awk '{print $NF}' | \
awk -F'=' '{print $2}' | \
awk '{sum+=$1; count++} END {print "Average: " sum/count "s"}'

echo "Slowest Requests:"
tail -1000 /var/log/nginx/detailed_access.log | \
sort -k12 -nr | head -10