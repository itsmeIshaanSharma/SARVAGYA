#!/bin/bash
echo "Stopping all services..."
kill_port() {
    lsof -ti :"$1" | xargs kill -9 2>/dev/null || true
}
kill_port 5001
kill_port 3000
echo "All services stopped."
