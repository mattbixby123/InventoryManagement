#!/bin/bash

echo "=== Nginx Performance Analysis ==="
echo ""

# Check if log file exists
LOG_FILE="./logs/detailed_access.log"
if [ ! -f "$LOG_FILE" ]; then
    echo "Error: Log file $LOG_FILE not found!"
    exit 1
fi

echo "Analyzing last 1000 requests from: $LOG_FILE"
echo ""

# Extract and calculate average response time
echo "Average Response Times:"
avg_time=$(tail -1000 "$LOG_FILE" | awk -F'rt=' '{print $2}' | awk '{print $1}' | grep -E '^[0-9.]+' | \
awk '{sum+=$1; count++} END {if (count>0) printf "Average: %.3fs\n", sum/count; else print "No valid response times found"}')
echo "$avg_time"

echo ""

# Show slowest requests
echo "Slowest Requests:"
tail -1000 "$LOG_FILE" | \
awk -F'rt=' '{print $1 $2}' | \
awk '{
    # Extract response time
    rt = $0
    sub(/.*rt=/, "", rt)
    split(rt, rt_arr, " ")
    rt_val = rt_arr[1]
    
    # Reconstruct the log line without splitting the request
    printf "%-10s %s\n", rt_val, $0
}' | \
sort -nr -k1,1 | \
head -10 | \
awk '{
    # Format the output nicely
    printf "%-8s %s %s %s\n", $1, $2, $3, $4
    for(i=5;i<=NF;i++) printf "%s ", $i
    printf "\n\n"
}'