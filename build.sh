#!/bin/bash

# Netlify build optimization script
echo "🚀 Starting optimized build process..."

# Check Node version
echo "📋 Node version: $(node --version)"
echo "📋 NPM version: $(npm --version)"

# Clean install dependencies for consistent builds
echo "📦 Installing dependencies..."
npm ci --silent --no-audit --no-fund

# Type check
echo "🔍 Running type check..."
npm run type-check

# Build the project
echo "🏗️ Building project..."
npm run build

echo "✅ Build completed successfully!"

# Display build info
echo "📊 Build stats:"
if [ -d "dist" ]; then
    echo "   - Dist folder size: $(du -sh dist | cut -f1)"
    echo "   - Files in dist: $(find dist -type f | wc -l)"
fi
