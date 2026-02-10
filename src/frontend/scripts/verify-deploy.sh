#!/bin/bash

# Tripple Host - Deployment Verification Script
# Verifies that the deployed application is accessible and functional
#
# USAGE: Run this script from the repository root directory:
#   ./frontend/scripts/verify-deploy.sh

set -e
set -u
set -o pipefail

echo "🔍 Tripple Host - Deployment Verification"
echo "=========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

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
if [ ! -f "dfx.json" ]; then
    error_exit "dfx.json not found. Please run this script from the repository root directory:
    ./frontend/scripts/verify-deploy.sh"
fi

print_success "Working directory verified (repository root)"
echo ""

# Check if dfx is available
if ! command -v dfx &> /dev/null; then
    error_exit "dfx is not installed. Install it with:
    sh -ci \"\$(curl -fsSL https://internetcomputer.org/install.sh)\""
fi

# Get canister IDs
echo "📋 Retrieving canister information..."
BACKEND_CANISTER_ID=$(dfx canister id backend --network ic 2>/dev/null || echo "")
FRONTEND_CANISTER_ID=$(dfx canister id frontend --network ic 2>/dev/null || echo "")

if [ -z "$BACKEND_CANISTER_ID" ] || [ -z "$FRONTEND_CANISTER_ID" ]; then
    error_exit "Could not retrieve canister IDs. Make sure canisters are deployed to IC mainnet.
    Run './frontend/scripts/deploy-ic.sh' to deploy."
fi

print_success "Backend Canister:  $BACKEND_CANISTER_ID"
print_success "Frontend Canister: $FRONTEND_CANISTER_ID"
echo ""

# Check canister status
echo "🔍 Checking canister status..."
BACKEND_STATUS=$(dfx canister status backend --network ic 2>&1)
FRONTEND_STATUS=$(dfx canister status frontend --network ic 2>&1)

BACKEND_RUNNING=false
FRONTEND_RUNNING=false

if echo "$BACKEND_STATUS" | grep -q "Status: Running"; then
    print_success "Backend canister is running"
    BACKEND_RUNNING=true
else
    echo -e "${RED}❌ Backend canister is not running${NC}"
    echo "$BACKEND_STATUS"
    error_exit "Backend canister must be running. Check canister status and cycles balance."
fi

if echo "$FRONTEND_STATUS" | grep -q "Status: Running"; then
    print_success "Frontend canister is running"
    FRONTEND_RUNNING=true
else
    echo -e "${RED}❌ Frontend canister is not running${NC}"
    echo "$FRONTEND_STATUS"
    error_exit "Frontend canister must be running. Check canister status and cycles balance."
fi

echo ""

# Test frontend URL accessibility
FRONTEND_URL="https://$FRONTEND_CANISTER_ID.ic0.app"
echo "🌐 Testing frontend accessibility..."
echo "URL: $FRONTEND_URL"

if command -v curl &> /dev/null; then
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" --max-time 10 || echo "000")
    if [ "$HTTP_STATUS" = "200" ]; then
        print_success "Frontend is accessible (HTTP $HTTP_STATUS)"
    else
        echo -e "${RED}❌ Frontend returned HTTP $HTTP_STATUS${NC}"
        error_exit "Frontend is not accessible. Check canister status and try again in a few moments."
    fi
else
    print_warning "curl not found, skipping HTTP check"
    echo "Install curl to enable HTTP accessibility testing"
fi

echo ""
echo -e "${GREEN}✅ Automated Verification Complete${NC}"
echo "===================================="
echo ""
echo "All automated checks passed! Your application is deployed and accessible."
echo ""
echo "📝 Manual Verification Checklist:"
echo ""
echo "Please complete these critical smoke tests to ensure full functionality:"
echo ""
echo "1. 🌐 Open your app in a browser:"
echo "   $FRONTEND_URL"
echo ""
echo "2. 🔍 Verify no console errors on load:"
echo "   - Press F12 to open browser developer tools"
echo "   - Check the Console tab"
echo "   - Should see no red errors on initial page load"
echo "   - Actor should initialize successfully"
echo ""
echo "3. 🔐 Test Internet Identity login:"
echo "   - Click the 'Login' button in the header"
echo "   - Complete the Internet Identity authentication flow"
echo "   - Verify the button changes to 'Logout' after successful login"
echo ""
echo "4. 🚪 Test Internet Identity logout:"
echo "   - Click the 'Logout' button"
echo "   - Verify you are logged out"
echo "   - Verify the button changes back to 'Login'"
echo ""
echo "5. 👑 Claim initial admin access (first-time setup only):"
echo "   - Log in with Internet Identity"
echo "   - If no admins exist, you should see 'Setup Admin Access' button"
echo "   - Click it and complete the admin claim process"
echo "   - Verify 'Admin Panel' button appears after successful claim"
echo ""
echo "6. 🛡️  Verify admin setup is properly gated:"
echo "   - Log out and log in with a different Internet Identity"
echo "   - Verify 'Setup Admin Access' button does NOT appear"
echo "   - Verify non-admin users cannot access the Admin Panel"
echo ""
echo "7. ⚙️  Open the Admin Panel (admin users only):"
echo "   - After claiming admin access, click 'Admin Panel' button"
echo "   - Verify the admin panel opens with all tabs"
echo "   - Test viewing pricing plans, site settings, logo, and admin list"
echo ""
echo "8. ✨ Test basic functionality:"
echo "   - Navigate through all landing page sections"
echo "   - Verify pricing plans display correctly"
echo "   - Test responsive design on mobile devices"
echo "   - Verify no console errors during navigation"
echo ""
echo "🔧 Troubleshooting:"
echo ""
echo "If you encounter issues:"
echo "  • Check browser console (F12) for detailed error messages"
echo "  • Verify environment variables in frontend/.env:"
echo "    - DFX_NETWORK=ic"
echo "    - II_URL=https://identity.ic0.app"
echo "  • Check canister cycles balance:"
echo "    dfx canister status backend --network ic"
echo "    dfx canister status frontend --network ic"
echo "  • Clear browser cache and try again"
echo "  • Try in an incognito/private browser window"
echo ""
echo "📚 For detailed troubleshooting, see frontend/DEPLOYMENT.md"
echo ""
