#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
BACKEND_PORT=5001
FRONTEND_PORT=3000
HOST=0.0.0.0

echo -e "${BLUE}Starting MADHAVA Services...${NC}\n"

# Create necessary directories
mkdir -p logs

# Function to check if a port is in use
check_port() {
    lsof -i :"$1" > /dev/null 2>&1
    return $?
}

# Function to kill process on a port
kill_port() {
    echo -e "${BLUE}Killing process on port $1...${NC}"
    lsof -ti :"$1" | xargs kill -9 2>/dev/null || true
}

# Check if ports are already in use
if check_port $BACKEND_PORT || check_port $FRONTEND_PORT; then
    echo -e "${RED}Ports $BACKEND_PORT or $FRONTEND_PORT are already in use. Killing processes...${NC}"
    kill_port $BACKEND_PORT
    kill_port $FRONTEND_PORT
    sleep 1
fi

# Check and install frontend dependencies
setup_frontend() {
    echo -e "${GREEN}Setting up frontend dependencies...${NC}"
    cd client
    # Create .env file for frontend
    cat > .env << EOF
SKIP_PREFLIGHT_CHECK=true
VITE_API_URL=http://localhost:${BACKEND_PORT}
HOST=${HOST}
PORT=${FRONTEND_PORT}
EOF
    npm install
    cd ..
}

# Setup frontend
setup_frontend

# Start backend server
echo -e "${GREEN}Starting backend server...${NC}"
(cd backend && npm install && npm run dev > ../logs/backend.log 2>&1 &)
BACKEND_PID=$!

# Wait for backend to start
echo -e "${BLUE}Waiting for backend to start...${NC}"
sleep 2

# Start frontend server
echo -e "${GREEN}Starting frontend server...${NC}"
(cd client && npm run dev > ../logs/frontend.log 2>&1 &)
FRONTEND_PID=$!

# Function to handle script termination
cleanup() {
  echo -e "\n${BLUE}Shutting down servers...${NC}"
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
  exit 0
}

# Register the cleanup function for when script receives SIGINT (Ctrl+C)
trap cleanup SIGINT

# Print status
echo -e "\n${GREEN}All services started!${NC}"
echo -e "${GREEN}Frontend: http://localhost:${FRONTEND_PORT}${NC}"
echo -e "${GREEN}Backend: http://localhost:${BACKEND_PORT}${NC}"
echo -e "\n${GREEN}Logs are available in the logs directory:${NC}"
echo "- Frontend: logs/frontend.log"
echo "- Backend: logs/backend.log"
echo -e "\n${BLUE}Press Ctrl+C to stop both servers${NC}"

# Keep the script running and show logs
echo -e "\n${GREEN}Showing logs (Ctrl+C to stop viewing logs, services will continue running)${NC}\n"
tail -f logs/*.log