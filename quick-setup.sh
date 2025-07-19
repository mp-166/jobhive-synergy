#!/bin/bash

# Empower Platform - Quick Local Setup Script
echo "🚀 EMPOWER PLATFORM - QUICK LOCAL SETUP"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[✅]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[ℹ️]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠️]${NC} $1"
}

print_error() {
    echo -e "${RED}[❌]${NC} $1"
}

# Check if running on a fresh system
if [ ! -d "node_modules" ]; then
    print_info "Fresh installation detected. Setting up Empower Platform..."
    echo ""
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed!"
        print_info "Please install Node.js 18+ from: https://nodejs.org"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed!"
        print_info "Please install npm (comes with Node.js)"
        exit 1
    fi
    
    print_status "Node.js and npm are installed"
    echo ""
    
    # Install dependencies
    print_info "Installing project dependencies..."
    print_warning "This may take 2-5 minutes depending on internet speed..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_status "Dependencies installed successfully!"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
    echo ""
else
    print_status "Dependencies already installed"
    echo ""
fi

# Check if server is already running
if lsof -i:5173 > /dev/null 2>&1; then
    print_warning "Development server is already running on port 5173"
    print_info "Visit: http://localhost:5173"
    print_info "Visit Demo: http://localhost:5173/demo"
    echo ""
    
    echo "Options:"
    echo "1. Keep current server running"
    echo "2. Restart server"
    echo "3. Use different port"
    echo ""
    read -p "Choose option (1-3): " choice
    
    case $choice in
        1)
            print_info "Keeping current server running"
            ;;
        2)
            print_info "Restarting server..."
            pkill -f "vite" > /dev/null 2>&1
            sleep 2
            npm run dev &
            ;;
        3)
            read -p "Enter port number (e.g., 3000): " port
            npm run dev -- --port $port &
            ;;
        *)
            print_info "Keeping current server running"
            ;;
    esac
else
    # Start development server
    print_info "Starting development server..."
    npm run dev &
    
    # Wait for server to start
    sleep 3
    
    # Check if server started successfully
    if lsof -i:5173 > /dev/null 2>&1; then
        print_status "Development server started successfully!"
    else
        print_error "Failed to start development server"
        print_info "Try running: npm run dev"
        exit 1
    fi
fi

echo ""
print_status "🎉 EMPOWER PLATFORM IS READY!"
echo ""

echo "📱 ACCESS YOUR MVP:"
echo "==================="
echo "🏠 Main App:        http://localhost:5173"
echo "🧪 Demo & Testing:  http://localhost:5173/demo"
echo "✅ Verification:    http://localhost:5173/verification"
echo "💼 Job Posting:     http://localhost:5173/post-job"
echo "🔍 Browse Jobs:     http://localhost:5173/jobs"
echo ""

echo "🧪 QUICK TESTS:"
echo "==============="
echo "1. Commission Calculator: Test ₹3000 → 12% fee"
echo "2. Payment System: Experience escrow flow"
echo "3. Verification: Upload sample documents"
echo "4. Mobile Test: Open on phone browser"
echo ""

echo "🔧 USEFUL COMMANDS:"
echo "==================="
echo "Stop server:     Ctrl+C"
echo "Restart server:  npm run dev"
echo "Build project:   npm run build"
echo "Run tests:       npm run test"
echo ""

echo "📋 NEXT STEPS:"
echo "==============="
echo "1. Test all features at http://localhost:5173/demo"
echo "2. Explore code in src/ folder"
echo "3. Deploy to production with ./deploy-production.sh"
echo "4. Set up payment gateway for real transactions"
echo ""

print_status "Happy coding! 🚀"

# Optional: Open browser automatically (uncomment if needed)
# if command -v xdg-open > /dev/null; then
#     xdg-open http://localhost:5173/demo
# elif command -v open > /dev/null; then
#     open http://localhost:5173/demo
# fi