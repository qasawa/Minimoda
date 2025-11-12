#!/bin/bash

# WARNING: Never commit this file with real credentials!
# This is a template for setting up environment variables

echo "🚨 SECURITY WARNING: Do not use this script in production!"
echo "This script creates a template .env.local file."
echo "Please replace all placeholder values with your actual credentials."
echo ""

# Create .env.local file with PLACEHOLDER configuration
cat > .env.local << EOF
# ⚠️  REPLACE ALL THESE VALUES WITH YOUR ACTUAL CREDENTIALS
# 🚨 NEVER commit real credentials to version control!

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL_HERE
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE

# Isracard Payment Configuration
ISRACARD_API_URL=https://api.isracard.co.il
ISRACARD_MERCHANT_ID=YOUR_MERCHANT_ID_HERE
ISRACARD_TERMINAL_ID=YOUR_TERMINAL_ID_HERE
ISRACARD_SECRET_KEY=YOUR_SECRET_KEY_HERE

# WhatsApp Business API Configuration
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_ACCESS_TOKEN=YOUR_WHATSAPP_ACCESS_TOKEN_HERE
WHATSAPP_PHONE_NUMBER_ID=YOUR_PHONE_NUMBER_ID_HERE
WHATSAPP_WEBHOOK_TOKEN=YOUR_WEBHOOK_TOKEN_HERE

# WhatsApp Public Settings (for contact buttons)
NEXT_PUBLIC_WHATSAPP_NUMBER=YOUR_WHATSAPP_NUMBER_HERE
NEXT_PUBLIC_WHATSAPP_MESSAGE=שלום! אני מעוניין/ת במוצר

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development

# Security Keys (Generate secure random keys!)
JWT_SECRET=YOUR_SECURE_JWT_SECRET_HERE
ADMIN_SESSION_SECRET=YOUR_ADMIN_SESSION_SECRET_HERE

# Email Configuration (Optional)
SMTP_HOST=YOUR_SMTP_HOST_HERE
SMTP_PORT=587
SMTP_USER=YOUR_SMTP_USER_HERE
SMTP_PASS=YOUR_SMTP_PASS_HERE
EOF

echo "✅ Template .env.local file created!"
echo ""
echo "🔧 NEXT STEPS:"
echo "1. Open .env.local and replace ALL placeholder values"
echo "2. Get your Supabase credentials from: https://supabase.com/dashboard"
echo "3. Get your Isracard credentials from: https://developers.isracard.co.il/"
echo "4. Set up WhatsApp Business API: https://developers.facebook.com/docs/whatsapp"
echo "5. Generate secure JWT secrets: https://jwt.io/"
echo ""
echo "🚨 SECURITY REMINDER:"
echo "- Never commit .env.local to git"
echo "- Use different credentials for dev/staging/production"
echo "- Rotate secrets regularly"
echo "- Enable 2FA on all accounts"
