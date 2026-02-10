#!/bin/bash

# Tripple Host - IC Mainnet Deployment Script
# This script automates the deployment process to Internet Computer mainnet
# 
# USAGE: Run this script from the repository root directory:
#   ./frontend/scripts/deploy-ic.sh

set -e  # Exit on any error
set -u  # Exit on undefined variable
set -o pipefail  # Exit on pipe failure

echo "🚀 Tripple Host - IC Mainnet Deployment"
echo "========================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print error and exit
error_exit() {
    echo -e "${RED}❌ Error: $1${NC}" >&2
    exit 1
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠️${NC}  $1"
}

# Check working directory
# This script expects to be run from the repository root
if [ ! -f "dfx.json" ]; then
    error_exit "dfx.json not found. Please run this script from the repository root directory:
    ./frontend/scripts/deploy-ic.sh"
fi

if [ ! -d "frontend" ]; then
    error_exit "frontend directory not found. Please run this script from the repository root directory:
    ./frontend/scripts/deploy-ic.sh"
fi

print_success "Working directory verified (repository root)"

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    error_exit "dfx is not installed. Install it with:
    sh -ci \"\$(curl -fsSL https://internetcomputer.org/install.sh)\""
fi

print_success "dfx is installed: $(dfx --version)"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    error_exit "pnpm is not installed. Install it with:
    npm install -g pnpm"
fi

print_success "pnpm is installed: $(pnpm --version)"
echo ""

# Check if .env file exists and has correct settings
if [ ! -f "frontend/.env" ]; then
    print_warning ".env file not found in frontend/"
    echo "Creating .env from .env.example with mainnet settings..."
    if [ -f "frontend/.env.example" ]; then
        cp frontend/.env.example frontend/.env
        # Update to mainnet settings
        sed -i.bak 's/DFX_NETWORK=local/DFX_NETWORK=ic/' frontend/.env
        sed -i.bak 's|II_URL=http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943|II_URL=https://identity.ic0.app|' frontend/.env
        rm -f frontend/.env.bak
        print_success "Created frontend/.env with mainnet settings"
    else
        error_exit "frontend/.env.example not found. Cannot create .env file."
    fi
else
    # Verify .env has correct mainnet settings
    if ! grep -q "DFX_NETWORK=ic" frontend/.env; then
        print_warning "DFX_NETWORK is not set to 'ic' in frontend/.env"
        echo "Please update frontend/.env to include: DFX_NETWORK=ic"
    fi
    if ! grep -q "II_URL=https://identity.ic0.app" frontend/.env; then
        print_warning "II_URL is not set to production URL in frontend/.env"
        echo "Please update frontend/.env to include: II_URL=https://identity.ic0.app"
    fi
fi

echo ""

# Confirm deployment to mainnet
echo -e "${YELLOW}⚠️  You are about to deploy to IC MAINNET${NC}"
echo "This will consume cycles. Make sure you have sufficient cycles in your wallet."
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

echo ""
echo "📦 Step 1: Installing dependencies..."
cd frontend
pnpm install || error_exit "Failed to install dependencies"
cd ..
print_success "Dependencies installed"

echo ""
echo "🔧 Step 2: Creating canisters on IC mainnet..."
dfx canister create --all --network ic || {
    print_warning "Canisters may already exist, continuing..."
}
print_success "Canisters created/verified"

echo ""
echo "🔨 Step 3: Generating backend bindings..."
dfx generate backend --network ic || error_exit "Failed to generate backend bindings"
print_success "Backend bindings generated"

echo ""
echo "🏗️  Step 4: Deploying backend canister..."
dfx deploy backend --network ic || error_exit "Failed to deploy backend canister"
print_success "Backend canister deployed"

echo ""
echo "⚛️  Step 5: Building frontend..."
cd frontend
pnpm run build:skip-bindings || error_exit "Failed to build frontend"
cd ..
print_success "Frontend built"

echo ""
echo "🌐 Step 6: Deploying frontend canister..."
dfx deploy frontend --network ic || error_exit "Failed to deploy frontend canister"
print_success "Frontend canister deployed"

echo ""
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo "========================================"
echo ""

# Get canister IDs
BACKEND_CANISTER_ID=$(dfx canister id backend --network ic)
FRONTEND_CANISTER_ID=$(dfx canister id frontend --network ic)

echo "📋 Deployment Information:"
echo "-------------------------"
echo "Backend Canister ID:  $BACKEND_CANISTER_ID"
echo "Frontend Canister ID: $FRONTEND_CANISTER_ID"
echo ""
echo "🌍 Your app is live at:"
echo "https://$FRONTEND_CANISTER_ID.ic0.app"
echo ""
echo "🔍 Next Steps - Verification Checklist:"
echo "1. Open the URL above in your browser"
echo "2. Verify no console errors on page load (press F12)"
echo "3. Test Internet Identity login and logout"
echo "4. Claim initial admin access (first user only)"
echo "5. Open the Admin Panel after admin claim"
echo "6. Verify admin setup is gated (subsequent users cannot claim)"
echo ""
echo "💡 Run './frontend/scripts/verify-deploy.sh' for automated verification"
echo ""
echo "📊 Check canister status:"
echo "  dfx canister status backend --network ic"
echo "  dfx canister status frontend --network ic"
echo ""
