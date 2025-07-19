#!/bin/bash

# Empower Platform Production Deployment Script
echo "🚀 EMPOWER PLATFORM - PRODUCTION DEPLOYMENT"
echo "============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_step "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm"
        exit 1
    fi
    
    print_status "✅ Node.js and npm are installed"
}

# Install project dependencies
install_dependencies() {
    print_step "Installing project dependencies..."
    npm install
    print_status "✅ Dependencies installed"
}

# Build the project
build_project() {
    print_step "Building project for production..."
    npm run build
    if [ $? -eq 0 ]; then
        print_status "✅ Build completed successfully"
    else
        print_error "❌ Build failed"
        exit 1
    fi
}

# Deploy to Vercel
deploy_vercel() {
    print_step "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    print_status "Starting Vercel deployment..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        print_status "✅ Frontend deployed to Vercel successfully!"
    else
        print_error "❌ Vercel deployment failed"
        exit 1
    fi
}

# Deploy to Netlify (alternative)
deploy_netlify() {
    print_step "Preparing for Netlify deployment..."
    
    if [ ! -d "dist" ]; then
        print_error "❌ Build directory not found. Run build first."
        exit 1
    fi
    
    print_status "✅ Build directory ready for Netlify"
    print_status "📁 Upload the 'dist' folder to https://netlify.com/drop"
    print_status "🔧 Or connect your GitHub repo for auto-deployment"
}

# Deploy backend to Supabase
deploy_backend() {
    print_step "Deploying backend to Supabase..."
    
    if ! command -v supabase &> /dev/null; then
        print_warning "Supabase CLI not found. Installing..."
        npm install -g supabase
    fi
    
    print_status "Running backend deployment script..."
    if [ -f "./deploy-backend.sh" ]; then
        chmod +x deploy-backend.sh
        ./deploy-backend.sh
    else
        print_error "❌ Backend deployment script not found"
        exit 1
    fi
}

# Create environment file template
create_env_template() {
    print_step "Creating environment file template..."
    
    cat > .env.production.template << EOL
# Empower Platform Production Environment Variables
# Copy this file to .env.production and fill in your values

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# App Configuration
VITE_APP_ENV=production
VITE_APP_NAME=Empower Platform
VITE_APP_VERSION=1.0.0

# Payment Gateway (for future integration)
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
VITE_RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# SMS Integration (for future integration)
VITE_SMS_API_KEY=your-sms-api-key
VITE_SMS_SENDER_ID=your-sender-id

# Analytics (optional)
VITE_GOOGLE_ANALYTICS_ID=your-ga-tracking-id

# Domain Configuration
VITE_APP_DOMAIN=empowerplatform.in
VITE_API_DOMAIN=api.empowerplatform.in
EOL

    print_status "✅ Environment template created: .env.production.template"
}

# Main deployment function
main() {
    echo "Choose deployment option:"
    echo "1. Full deployment (Backend + Frontend to Vercel)"
    echo "2. Frontend only (Vercel)"
    echo "3. Frontend only (Netlify)"
    echo "4. Backend only (Supabase)"
    echo "5. Build only (no deployment)"
    echo "6. Create environment template"
    echo ""
    read -p "Enter your choice (1-6): " choice
    
    case $choice in
        1)
            print_status "🎯 Starting full deployment..."
            check_dependencies
            install_dependencies
            build_project
            deploy_backend
            deploy_vercel
            create_env_template
            ;;
        2)
            print_status "🎯 Starting frontend deployment to Vercel..."
            check_dependencies
            install_dependencies
            build_project
            deploy_vercel
            ;;
        3)
            print_status "🎯 Preparing frontend for Netlify..."
            check_dependencies
            install_dependencies
            build_project
            deploy_netlify
            ;;
        4)
            print_status "🎯 Starting backend deployment..."
            deploy_backend
            ;;
        5)
            print_status "🎯 Building project..."
            check_dependencies
            install_dependencies
            build_project
            ;;
        6)
            create_env_template
            ;;
        *)
            print_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac
    
    echo ""
    print_status "🎉 Deployment process completed!"
    echo ""
    echo "📋 POST-DEPLOYMENT CHECKLIST:"
    echo "================================"
    echo "□ Update environment variables with your Supabase credentials"
    echo "□ Test all API endpoints"
    echo "□ Verify payment calculator works"
    echo "□ Test document verification flow"
    echo "□ Check mobile responsiveness"
    echo "□ Setup custom domain (optional)"
    echo "□ Configure analytics (optional)"
    echo "□ Setup monitoring and alerts"
    echo ""
    echo "📞 SUPPORT:"
    echo "• Supabase: https://supabase.com/docs"
    echo "• Vercel: https://vercel.com/docs"
    echo "• Netlify: https://docs.netlify.com"
    echo ""
    echo "🚀 Your Empower Platform is ready to transform the gig economy!"
}

# Run main function
main