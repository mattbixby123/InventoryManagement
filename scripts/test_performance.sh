#!/bin/bash
# test_performance.sh - Performance testing with data storage
# Run this from your local machine or VPS

set -e

SITE_URL="https://inventory.matthewbixby.com"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
RESULTS_DIR="performance_data"
RESULTS_FILE="${RESULTS_DIR}/performance_${TIMESTAMP}.log"

echo "=== Performance Testing Started ==="
echo "Testing: $SITE_URL"
echo "Results will be saved to: $RESULTS_FILE"

# Create performance_data directory if it doesn't exist
mkdir -p "$RESULTS_DIR"

# Create results file with header
cat > "$RESULTS_FILE" << EOF
# Performance Test Results
# Test started: $(date)
# Target URL: $SITE_URL
# Format: test_number,endpoint,total_time,namelookup_time,connect_time,starttransfer_time
EOF

echo ""
echo "Testing dashboard endpoint (10 requests)..."

for i in {1..10}; do
    echo -n "Request $i/10... "
    
    # Capture detailed timing data
    CURL_OUTPUT=$(curl -w "%{time_total},%{time_namelookup},%{time_connect},%{time_starttransfer}" \
                      -s -o /dev/null "${SITE_URL}/dashboard" 2>/dev/null)
    
    # Save to results file
    echo "$i,dashboard,$CURL_OUTPUT" >> "$RESULTS_FILE"
    
    # Show quick result
    TOTAL_TIME=$(echo "$CURL_OUTPUT" | cut -d',' -f1)
    echo "Total: ${TOTAL_TIME}s"
    
    sleep 1
done

echo ""
echo "Testing inventory endpoint (5 requests)..."

for i in {1..5}; do
    echo -n "Request $i/5... "
    
    CURL_OUTPUT=$(curl -w "%{time_total},%{time_namelookup},%{time_connect},%{time_starttransfer}" \
                      -s -o /dev/null "${SITE_URL}/inventory" 2>/dev/null)
    
    echo "$i,inventory,$CURL_OUTPUT" >> "$RESULTS_FILE"
    
    TOTAL_TIME=$(echo "$CURL_OUTPUT" | cut -d',' -f1)
    echo "Total: ${TOTAL_TIME}s"
    
    sleep 1
done

echo ""
echo "=== Test Complete ==="

# Calculate and display summary
echo "=== Summary ===" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

# Dashboard stats
DASHBOARD_AVG=$(grep ",dashboard," "$RESULTS_FILE" | cut -d',' -f3 | awk '{sum+=$1; count++} END {print sum/count}')
DASHBOARD_MAX=$(grep ",dashboard," "$RESULTS_FILE" | cut -d',' -f3 | sort -n | tail -1)
DASHBOARD_MIN=$(grep ",dashboard," "$RESULTS_FILE" | cut -d',' -f3 | sort -n | head -1)

echo "Dashboard Performance:" >> "$RESULTS_FILE"
echo "  Average: ${DASHBOARD_AVG}s" >> "$RESULTS_FILE"
echo "  Min: ${DASHBOARD_MIN}s" >> "$RESULTS_FILE"
echo "  Max: ${DASHBOARD_MAX}s" >> "$RESULTS_FILE"

# Inventory stats (if any requests were made)
if grep -q ",inventory," "$RESULTS_FILE"; then
    INVENTORY_AVG=$(grep ",inventory," "$RESULTS_FILE" | cut -d',' -f3 | awk '{sum+=$1; count++} END {print sum/count}')
    INVENTORY_MAX=$(grep ",inventory," "$RESULTS_FILE" | cut -d',' -f3 | sort -n | tail -1)
    INVENTORY_MIN=$(grep ",inventory," "$RESULTS_FILE" | cut -d',' -f3 | sort -n | head -1)
    
    echo "" >> "$RESULTS_FILE"
    echo "Inventory Performance:" >> "$RESULTS_FILE"
    echo "  Average: ${INVENTORY_AVG}s" >> "$RESULTS_FILE"
    echo "  Min: ${INVENTORY_MIN}s" >> "$RESULTS_FILE"
    echo "  Max: ${INVENTORY_MAX}s" >> "$RESULTS_FILE"
fi

# Display summary to console
echo ""
echo "Dashboard Performance:"
echo "  Average: ${DASHBOARD_AVG}s"
echo "  Min: ${DASHBOARD_MIN}s"
echo "  Max: ${DASHBOARD_MAX}s"

if grep -q ",inventory," "$RESULTS_FILE"; then
    echo ""
    echo "Inventory Performance:"
    echo "  Average: ${INVENTORY_AVG}s"
    echo "  Min: ${INVENTORY_MIN}s"
    echo "  Max: ${INVENTORY_MAX}s"
fi

echo ""
echo "Detailed results saved to: $RESULTS_FILE"
echo "View results: cat $RESULTS_FILE"
echo "List all test results: ls -la $RESULTS_DIR/"