#!/bin/bash

# StructurAI Deployment Script
# This script helps prepare and deploy the StructurAI application to Vercel

echo "🚀 Preparing StructurAI for deployment to Vercel..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git and try again."
    exit 1
fi

# Check if the current directory is a git repository
if [ ! -d .git ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit for Vercel deployment"
else
    echo "✅ Git repository already initialized."
    
    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        echo "📝 Committing changes..."
        git add .
        git commit -m "Update for Vercel deployment"
    else
        echo "✅ No uncommitted changes."
    fi
fi

# Generate a random AUTH_SECRET if not already set
if [ ! -f .env.production ] || ! grep -q "AUTH_SECRET=" .env.production || [ "$(grep "AUTH_SECRET=" .env.production | cut -d '=' -f2)" == '""' ]; then
    echo "🔑 Generating a new AUTH_SECRET..."
    AUTH_SECRET=$(openssl rand -base64 32)
    
    # Create or update .env.production
    if [ ! -f .env.production ]; then
        cp .env.example .env.production 2>/dev/null || echo "# Production environment variables" > .env.production
    fi
    
    # Update AUTH_SECRET in .env.production
    if grep -q "AUTH_SECRET=" .env.production; then
        sed -i '' "s|AUTH_SECRET=.*|AUTH_SECRET=\"$AUTH_SECRET\"|g" .env.production 2>/dev/null || sed -i "s|AUTH_SECRET=.*|AUTH_SECRET=\"$AUTH_SECRET\"|g" .env.production
    else
        echo "AUTH_SECRET=\"$AUTH_SECRET\"" >> .env.production
    fi
    
    echo "✅ AUTH_SECRET generated and added to .env.production."
else
    echo "✅ AUTH_SECRET already set in .env.production."
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "ℹ️ Vercel CLI is not installed. You can install it with: npm i -g vercel"
    echo "ℹ️ After installing, run 'vercel login' to authenticate."
    echo ""
    echo "📋 Manual Deployment Instructions:"
    echo "1. Push your code to GitHub:"
    echo "   git remote add origin https://github.com/yourusername/structurai.git"
    echo "   git push -u origin main"
    echo ""
    echo "2. Go to https://vercel.com/new to import your GitHub repository"
    echo ""
    echo "3. Set up the following environment variables in the Vercel dashboard:"
    echo "   - NEXT_PUBLIC_BASE_URL: Your Vercel deployment URL"
    echo "   - BASE_URL: Same as above"
    echo "   - AUTH_SECRET: $(grep "AUTH_SECRET=" .env.production | cut -d '=' -f2 | tr -d '\"')"
    echo "   - OPENROUTER_API_KEY: Your OpenRouter API key"
    echo "   - SKIP_ENV_VALIDATION: true"
    echo ""
    echo "4. After deployment, update NEXT_PUBLIC_BASE_URL and BASE_URL with your actual Vercel URL"
else
    echo "✅ Vercel CLI is installed."
    echo ""
    echo "🚀 You can deploy to Vercel with: vercel"
    echo "ℹ️ After deployment, update NEXT_PUBLIC_BASE_URL and BASE_URL in the Vercel dashboard"
fi

echo ""
echo "🎉 Deployment preparation complete!"
echo "📝 See README.md for detailed deployment instructions." 