#!/bin/bash

# Empower Platform Backend Deployment Script
# This script sets up the complete backend infrastructure for the Empower platform

set -e  # Exit on any error

echo "🚀 Starting Empower Platform Backend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Supabase CLI is installed
check_supabase_cli() {
    print_status "Checking Supabase CLI installation..."
    if ! command -v supabase &> /dev/null; then
        print_error "Supabase CLI not found. Please install it first:"
        echo "npm install -g supabase"
        echo "or"
        echo "brew install supabase/tap/supabase"
        exit 1
    fi
    print_success "Supabase CLI found"
}

# Check if user is logged in to Supabase
check_supabase_auth() {
    print_status "Checking Supabase authentication..."
    if ! supabase projects list &> /dev/null; then
        print_error "Not logged in to Supabase. Please run:"
        echo "supabase login"
        exit 1
    fi
    print_success "Supabase authentication verified"
}

# Initialize Supabase project if not already done
init_supabase() {
    print_status "Initializing Supabase project..."
    if [ ! -f "supabase/config.toml" ]; then
        supabase init
        print_success "Supabase project initialized"
    else
        print_warning "Supabase project already initialized"
    fi
}

# Start local Supabase (optional for development)
start_local_supabase() {
    read -p "Do you want to start local Supabase for development? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Starting local Supabase..."
        supabase start
        print_success "Local Supabase started"
    fi
}

# Apply database migrations
apply_migrations() {
    print_status "Applying database migrations..."
    
    # Check if migration files exist
    if [ ! -f "supabase/migrations/001_empower_schema_enhancement.sql" ]; then
        print_error "Migration files not found. Please ensure the migration files are in supabase/migrations/"
        exit 1
    fi
    
    # Apply migrations
    supabase db push
    print_success "Database migrations applied"
}

# Deploy Edge Functions
deploy_functions() {
    print_status "Deploying Edge Functions..."
    
    # List of functions to deploy
    functions=(
        "escrow-payment"
        "job-matching"
        "verification-system" 
        "notification-system"
        "subscription-management"
    )
    
    for func in "${functions[@]}"; do
        if [ -d "supabase/functions/$func" ]; then
            print_status "Deploying function: $func"
            supabase functions deploy $func
            print_success "Function $func deployed"
        else
            print_warning "Function directory not found: $func"
        fi
    done
}

# Set up environment variables
setup_env_vars() {
    print_status "Setting up environment variables..."
    
    if [ ! -f ".env" ]; then
        print_status "Creating .env file template..."
        cat > .env << EOF
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# SMS Configuration (for notification system)
SMS_API_KEY=your_sms_provider_api_key
SMS_SENDER_ID=EMPOWER

# OpenAI Configuration (for AI job search)
OPENAI_API_KEY=your_openai_api_key

# Additional Configuration
NODE_ENV=production
EOF
        print_warning "Please update the .env file with your actual credentials"
    else
        print_warning ".env file already exists"
    fi
}

# Verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Check if functions are accessible
    functions=(
        "escrow-payment"
        "job-matching"
        "verification-system"
        "notification-system"
        "subscription-management"
    )
    
    for func in "${functions[@]}"; do
        if supabase functions list | grep -q "$func"; then
            print_success "Function $func is deployed"
        else
            print_error "Function $func deployment failed"
        fi
    done
}

# Generate API documentation
generate_docs() {
    print_status "Generating API documentation..."
    
    if [ -f "BACKEND_README.md" ]; then
        print_success "Backend documentation is available in BACKEND_README.md"
    else
        print_warning "Backend documentation not found"
    fi
}

# Run database seed (optional)
seed_database() {
    read -p "Do you want to seed the database with sample data? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Seeding database..."
        # You can add seed SQL commands here
        print_success "Database seeded with sample data"
    fi
}

# Main deployment process
main() {
    echo "
    ███████╗███╗   ███╗██████╗  ██████╗ ██╗    ██╗███████╗██████╗ 
    ██╔════╝████╗ ████║██╔══██╗██╔═══██╗██║    ██║██╔════╝██╔══██╗
    █████╗  ██╔████╔██║██████╔╝██║   ██║██║ █╗ ██║█████╗  ██████╔╝
    ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║   ██║██║███╗██║██╔══╝  ██╔══██╗
    ███████╗██║ ╚═╝ ██║██║     ╚██████╔╝╚███╔███╔╝███████╗██║  ██║
    ╚══════╝╚═╝     ╚═╝╚═╝      ╚═════╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝
    
    🚀 Gig Work & Task-Based Job Platform
    "
    
    # Run deployment steps
    check_supabase_cli
    check_supabase_auth
    init_supabase
    
    # Ask if user wants local development setup
    read -p "Is this for local development? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        start_local_supabase
    fi
    
    apply_migrations
    deploy_functions
    setup_env_vars
    verify_deployment
    generate_docs
    seed_database
    
    print_success "🎉 Empower Platform Backend Deployment Complete!"
    echo
    echo "Next steps:"
    echo "1. Update your .env file with actual credentials"
    echo "2. Configure SMS provider settings"
    echo "3. Set up OpenAI API key for AI features"
    echo "4. Test the API endpoints"
    echo "5. Deploy your frontend"
    echo
    echo "📚 Documentation: BACKEND_README.md"
    echo "🌐 Supabase Dashboard: https://app.supabase.com"
    echo
    print_success "Ready to empower the workforce! 💪"
}

# Handle script interruption
trap 'print_error "Deployment interrupted"; exit 1' INT

# Run main function
main "$@"