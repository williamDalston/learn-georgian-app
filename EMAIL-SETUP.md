# Email Capture Setup Guide

## 📧 Email Capture Feature

The email capture banner collects user emails and sends notifications to `faradaybach@gmail.com` when someone subscribes.

---

## 🚀 Quick Setup (No Email Service Required)

**Current Setup:** The email capture works **without any email service** by logging captured emails to the console/Vercel logs.

**To view captured emails:**
1. Check Vercel deployment logs
2. Check server console logs
3. Emails are logged with format: `📧 EMAIL NOTIFICATION`

**This works immediately** - no configuration needed for basic logging.

---

## ✅ Recommended: Set Up Resend (Free Tier Available)

For **actual email delivery** to `faradaybach@gmail.com`, set up Resend (recommended for Vercel).

### Step 1: Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up (free tier: 100 emails/day)
3. Verify your domain or use their test domain

### Step 2: Get API Key

1. Go to Resend dashboard
2. Navigate to "API Keys"
3. Create new API key
4. Copy the key

### Step 3: Add to Vercel Environment Variables

In your Vercel project settings:

1. Go to **Settings** > **Environment Variables**
2. Add:
   - `RESEND_API_KEY`: `re_xxxxxxxxxxxxx` (your Resend API key)
   - `RESEND_FROM_EMAIL`: `onboarding@resend.dev` (or your verified domain email)
   - `NOTIFICATION_EMAIL`: `faradaybach@gmail.com` (already defaults to this)

### Step 4: Install Resend Package

```bash
npm install resend
```

### Step 5: Redeploy

Vercel will automatically redeploy with the new environment variables.

---

## 🔧 Alternative: SendGrid

If you prefer SendGrid:

1. Create SendGrid account
2. Get API key
3. Add to Vercel:
   - `SENDGRID_API_KEY`: `SG.xxxxxxxxxxxxx`
   - `SENDGRID_FROM_EMAIL`: `noreply@yourdomain.com`
   - `NOTIFICATION_EMAIL`: `faradaybach@gmail.com`
4. Install: `npm install @sendgrid/mail`

---

## 📋 Environment Variables

Add these to Vercel (Settings > Environment Variables):

```env
# Email Service (choose one)
RESEND_API_KEY=re_xxxxxxxxxxxxx          # For Resend
# OR
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx         # For SendGrid

# Email Configuration
RESEND_FROM_EMAIL=onboarding@resend.dev  # Resend from address
# OR
SENDGRID_FROM_EMAIL=noreply@yourdomain.com # SendGrid from address

NOTIFICATION_EMAIL=faradaybach@gmail.com  # Where to send notifications (default)
```

**Note:** `NOTIFICATION_EMAIL` defaults to `faradaybach@gmail.com` if not set.

---

## ✅ Testing

### Test Email Capture

1. Visit your deployed site
2. Enter an email in the capture banner
3. Click "Notify Me"
4. Check:
   - ✅ Success message appears
   - ✅ Email logged in Vercel logs (if no email service)
   - ✅ Email sent to faradaybach@gmail.com (if Resend/SendGrid configured)

### Test Locally

```bash
# Run development server
npm run dev

# Visit http://localhost:3000
# Try the email capture form
# Check terminal logs for captured emails
```

---

## 📧 Email Notification Format

When someone submits their email, you'll receive:

```
Subject: New Email Capture: Learn Georgian App

New email captured from Learn Georgian App:

Email: user@example.com
Date: 2025-01-XX...
User Agent: Mozilla/5.0...
IP: xxx.xxx.xxx.xxx

---

This email was sent automatically from the Learn Georgian App email capture form.
```

---

## 🔍 Troubleshooting

### Emails Not Sending?

1. **Check Vercel Logs**
   - Go to Vercel dashboard > Deployment > Functions tab
   - Check API route logs for errors

2. **Verify Environment Variables**
   - Ensure `RESEND_API_KEY` or `SENDGRID_API_KEY` is set
   - Check `NOTIFICATION_EMAIL` is correct

3. **Check Rate Limits**
   - Resend free tier: 100 emails/day
   - SendGrid free tier: 100 emails/day

4. **Verify Domain**
   - Resend: Verify domain or use `onboarding@resend.dev`
   - SendGrid: Verify domain for production

### Without Email Service

If no email service is configured, emails are **logged only**:
- Check Vercel function logs
- Check server console (development)
- Look for `📧 EMAIL NOTIFICATION` in logs

---

## 💡 Recommendations

**For MVP/Testing:**
- ✅ Use logging mode (no setup needed)
- ✅ Monitor Vercel logs manually

**For Production:**
- ✅ Set up Resend (free tier is enough)
- ✅ Verify your domain
- ✅ Monitor email delivery

---

## 📦 Package Installation

```bash
# For Resend
npm install resend

# OR for SendGrid
npm install @sendgrid/mail
```

**Note:** Packages are imported dynamically, so you only need to install the one you're using.

---

**Current Status:** ✅ Email capture works in logging mode (no setup needed)  
**Recommended:** Set up Resend for actual email delivery (takes 5 minutes)

