# Tripple Host - Deployment Guide

This guide provides step-by-step instructions for deploying the Tripple Host application to the Internet Computer (IC) mainnet.

## Prerequisites

### Required Tools

1. **dfx (DFINITY Canister SDK)**
   - Install: `sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"`
   - Verify: `dfx --version` (requires v0.15.0 or later)

2. **Node.js and pnpm**
   - Node.js v18+ required
   - Install pnpm: `npm install -g pnpm`
   - Verify: `node --version && pnpm --version`

3. **Internet Identity**
   - You'll need an Internet Identity to claim admin access
   - Create one at: https://identity.ic0.app

### Initial Setup

1. Clone the repository and install dependencies:
   ```bash
   cd frontend
   pnpm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Configure environment variables (see Environment Configuration section below)

## Environment Configuration

The frontend requires specific environment variables for production deployment. Copy `.env.example` to `.env` and configure:

### Local Development

For local development with `dfx start`:

