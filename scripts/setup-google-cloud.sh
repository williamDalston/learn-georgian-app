#!/bin/bash

# Google Cloud TTS Setup Helper Script
# This script helps verify your Google Cloud TTS setup

echo "🔍 Checking Google Cloud TTS Setup..."
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ .env.local file exists"
    source .env.local
    
    # Check if GOOGLE_CLOUD_PROJECT_ID is set
    if [ -z "$GOOGLE_CLOUD_PROJECT_ID" ]; then
        echo "❌ GOOGLE_CLOUD_PROJECT_ID not set in .env.local"
    else
        echo "✅ GOOGLE_CLOUD_PROJECT_ID: $GOOGLE_CLOUD_PROJECT_ID"
    fi
    
    # Check if GOOGLE_APPLICATION_CREDENTIALS is set
    if [ -z "$GOOGLE_APPLICATION_CREDENTIALS" ]; then
        echo "❌ GOOGLE_APPLICATION_CREDENTIALS not set in .env.local"
    else
        if [ -f "$GOOGLE_APPLICATION_CREDENTIALS" ]; then
            echo "✅ Service account key file exists: $GOOGLE_APPLICATION_CREDENTIALS"
        else
            echo "❌ Service account key file not found: $GOOGLE_APPLICATION_CREDENTIALS"
        fi
    fi
else
    echo "❌ .env.local file not found"
    echo "   Create it from .env.local.example"
fi

echo ""
echo "📦 Checking packages..."
if npm list @google-cloud/text-to-speech > /dev/null 2>&1; then
    echo "✅ @google-cloud/text-to-speech installed"
else
    echo "❌ @google-cloud/text-to-speech not installed"
    echo "   Run: npm install @google-cloud/text-to-speech"
fi

if npm list ts-node > /dev/null 2>&1; then
    echo "✅ ts-node installed"
else
    echo "❌ ts-node not installed"
    echo "   Run: npm install ts-node --save-dev"
fi

echo ""
echo "🎯 Next steps:"
echo "1. Create Google Cloud project"
echo "2. Enable Cloud Text-to-Speech API"
echo "3. Create service account with 'Cloud Text-to-Speech API User' role"
echo "4. Download service account JSON key"
echo "5. Update .env.local with your values"
echo "6. Test: npm run generate:audio:custom 'ა' 'test' word"

