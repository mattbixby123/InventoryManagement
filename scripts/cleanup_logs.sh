#!/bin/bash
# cleanup_logs.sh
echo "=== Log Cleanup ==="
echo "Current log size:"
du -sh logs/

# Keep only last 1000 lines (safer approach)
if [ -f logs/detailed_access.log ]; then
    tail -1000 logs/detailed_access.log > logs/detailed_access.log.tmp && \
    mv logs/detailed_access.log.tmp logs/detailed_access.log
    echo "Log truncated to last 1000 lines"
else
    echo "No log file found"
fi

echo "New log size:"
du -sh logs/