# test_performance.sh (run from your local machine)
#!/bin/bash
echo "Testing current performance..."
for i in {1..10}; do
    curl -w "Total: %{time_total}s\n" -s -o /dev/null https://buoy.ufixu.net:8443/dashboard
    sleep 1
done