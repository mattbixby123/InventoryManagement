#!/bin/bash
# cleanup_logs.sh - Clean up all nginx log files
echo "=== Log Cleanup ==="
echo "Current log sizes:"
du -sh logs/

# Array of log files to clean
LOG_FILES=("access.log" "detailed_access.log" "error.log")

for log_file in "${LOG_FILES[@]}"; do
    if [ -f "logs/$log_file" ]; then
        # Keep only last 1000 lines
        tail -1000 "logs/$log_file" > "logs/$log_file.tmp" && \
        mv "logs/$log_file.tmp" "logs/$log_file"
        echo "✓ $log_file truncated to last 1000 lines"
    else
        echo "⚠ logs/$log_file not found"
    fi
done

echo ""
echo "New log sizes:"
du -sh logs/

# Optional: Show total lines remaining in each file
echo ""
echo "Lines remaining:"
for log_file in "${LOG_FILES[@]}"; do
    if [ -f "logs/$log_file" ]; then
        line_count=$(wc -l < "logs/$log_file")
        echo "  $log_file: $line_count lines"
    fi
done