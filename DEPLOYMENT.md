# Deployment Guide - WhatsApp Chat to PDF Converter

Complete guide to deploy your application using **Hetzner VPS** and **Cloudflare**.

---

## 🏗️ Architecture Overview

- **Frontend**: Next.js 16 (SSR/Static)
- **Backend**: Node.js + Express + Puppeteer
- **Server**: Hetzner VPS (Ubuntu 22.04/24.04)
- **CDN/DNS**: Cloudflare
- **SSL**: Let's Encrypt (via Certbot)
- **Process Manager**: PM2

---

## 📋 Prerequisites

✅ Hetzner Cloud account with VPS  
✅ Cloudflare account with domain  
✅ Domain name (DNS pointed to Cloudflare)  
✅ SSH client installed  

**Minimum VPS Requirements:**
- 2 vCPU
- 2GB RAM (Puppeteer needs memory)
- 20GB SSD
- Ubuntu 22.04 or 24.04

---

## 🚀 Part 1: Setup Hetzner VPS

### Step 1.1: Create VPS

1. Go to [Hetzner Cloud Console](https://console.hetzner.cloud)
2. **Create Project**: "whatsapp-pdf-app"
3. **Add Server**:
   - Location: Closest to your users (e.g., Finland for Europe)
   - Image: **Ubuntu 22.04** or **24.04**
   - Type: **CPX11** (€4.15/mo) or higher
   - Networking: Enable IPv4 + IPv6
   - SSH Keys: Add your public key
   - Backups: Optional (€0.83/mo extra)

4. **Get Server IP**: Note down the IPv4 address (e.g., `123.45.67.89`)

### Step 1.2: Initial Server Setup

```bash
# SSH into server
ssh root@YOUR_SERVER_IP

# Update system packages
apt update && apt upgrade -y

# Create deploy user (security best practice)
adduser deploy
usermod -aG sudo deploy

# Copy SSH keys to new user
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy

# Switch to deploy user
su - deploy
```

---

## 🔧 Part 2: Install Dependencies

### Step 2.1: Install Node.js 20+

```bash
# Install NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Verify
node --version  # Should show v20.x.x
npm --version   # Should show v10.x.x
```

### Step 2.2: Install Puppeteer System Dependencies

```bash
# Install Chrome/Chromium dependencies
sudo apt install -y \
  ca-certificates \
  fonts-liberation \
  fonts-noto-sans \
  fonts-noto-sans-bengali \
  fonts-noto-emoji \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgcc1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  wget \
  xdg-utils
```

### Step 2.3: Install Nginx (Reverse Proxy)

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Verify
sudo systemctl status nginx
```

### Step 2.4: Install PM2 (Process Manager)

```bash
npm install -g pm2

# Verify
pm2 --version
```

### Step 2.5: Install Git

```bash
sudo apt install -y git
git --version
```

---

## 📦 Part 3: Deploy Your Application

### Step 3.1: Upload Your Code

**Option A: Using Git (Recommended)**
```bash
# Create app directory
mkdir -p ~/apps
cd ~/apps

# Clone from your repo
git clone https://github.com/your-username/whatsapp-pdf.git
cd whatsapp-pdf
```

**Option B: Using SCP from Local Machine**
```powershell
# On your Windows machine (PowerShell)
scp -r "c:\Users\mubin\Documents\Practice\New folder" deploy@YOUR_SERVER_IP:~/apps/whatsapp-pdf
```

**Option C: Manual Upload**
```bash
# On server, create directory
mkdir -p ~/apps/whatsapp-pdf

# Use SFTP client like WinSCP or FileZilla to upload files
```

### Step 3.2: Deploy Backend

```bash
cd ~/apps/whatsapp-pdf/backend

# Install production dependencies
npm install --production

# Test manually first
node server.js
# Should see: ✅ Backend server running on http://localhost:3001
# Press Ctrl+C to stop

# Start with PM2
pm2 start server.js --name whatsapp-backend

# Save PM2 config
pm2 save

# Enable PM2 startup on boot
pm2 startup
# Copy and run the command it gives you (starts with sudo)

# Check status
pm2 list
pm2 logs whatsapp-backend
```

### Step 3.3: Deploy Frontend

```bash
cd ~/apps/whatsapp-pdf/frontend

# Install dependencies
npm install

# Build for production
npm run build

# Start with PM2
pm2 start npm --name whatsapp-frontend -- start

# Save config
pm2 save

# Check both services
pm2 list
```

Expected output:
```
┌─────┬────────────────────┬─────────┬─────────┬──────────┐
│ id  │ name               │ status  │ cpu     │ memory   │
├─────┼────────────────────┼─────────┼─────────┼──────────┤
│ 0   │ whatsapp-backend   │ online  │ 0%      │ 45 MB    │
│ 1   │ whatsapp-frontend  │ online  │ 0%      │ 120 MB   │
└─────┴────────────────────┴─────────┴─────────┴──────────┘
```

---

## 🌐 Part 4: Configure Cloudflare DNS

### Step 4.1: Add Your Domain to Cloudflare

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **Add Site**
3. Enter your domain: `yourdomain.com`
4. Select **Free Plan**
5. **Update nameservers at your registrar** (e.g., Namecheap, GoDaddy)
   - Copy Cloudflare nameservers (e.g., `ns1.cloudflare.com`)
   - Replace your registrar's nameservers
6. Wait for DNS propagation (5-30 minutes)

### Step 4.2: Add DNS Records

Go to **DNS** → **Records** → **Add record**:

| Type | Name | Content | Proxy Status | TTL |
|------|------|---------|--------------|-----|
| A | @ | `YOUR_SERVER_IP` | 🟠 Proxied | Auto |
| A | www | `YOUR_SERVER_IP` | 🟠 Proxied | Auto |
| CNAME | api | `yourdomain.com` | 🟠 Proxied | Auto |

**🟠 Orange Cloud = Proxied** (enables CDN, DDoS protection, caching)

### Step 4.3: SSL/TLS Settings

1. Go to **SSL/TLS** → **Overview**
2. Set: **Full (strict)** encryption mode
3. Go to **SSL/TLS** → **Edge Certificates**
4. Enable:
   - ✅ Always Use HTTPS
   - ✅ Automatic HTTPS Rewrites  
   - ✅ Minimum TLS Version: **1.2**
   - ✅ Opportunistic Encryption
   - ✅ TLS 1.3

---

## 🔒 Part 5: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Stop Nginx temporarily
sudo systemctl stop nginx

# Generate SSL certificate
sudo certbot certonly --standalone \
  -d yourdomain.com \
  -d www.yourdomain.com \
  -d api.yourdomain.com \
  --non-interactive \
  --agree-tos \
  --email your-email@example.com

# Start Nginx again
sudo systemctl start nginx

# Test auto-renewal
sudo certbot renew --dry-run

# Certificate locations:
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

---

## ⚙️ Part 6: Configure Nginx as Reverse Proxy

#### Apply Database Migration

```bash
# Run migrations on production database
npx wrangler d1 execute whatsapp-pdf-db --file=../database/schema.sql
```

### 3. Frontend Deployment (Vercel)

#### Install Vercel CLI

```bash
npm install -g vercel
```

#### Deploy

```bash
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

#### Set Environment Variables in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add:
- `NEXT_PUBLIC_API_URL`: Your Cloudflare Worker URL
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID

#### Alternative: Deploy to Cloudflare Pages

```bash
cd frontend

# Build the app
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages publish out
```

### 4. Google OAuth Production Setup

1. Go to Google Cloud Console
2. Update OAuth 2.0 Client:
   - Add production domain to **Authorized JavaScript origins**
   - Add production domain to **Authorized redirect URIs**
   - Example: `https://yourdomain.com`

### 5. Custom Domain Setup (Optional)

#### For Cloudflare Worker

1. Go to Cloudflare Dashboard → Workers & Pages
2. Select your worker
3. Go to Settings → Triggers
4. Add Custom Domain
5. Follow DNS setup instructions

#### For Frontend (Vercel)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### 6. Post-Deployment Testing

- [ ] Visit production URL
- [ ] Test Google sign-in
- [ ] Upload a test chat file
- [ ] Preview messages
- [ ] Generate PDF
- [ ] Verify PDF downloads correctly
- [ ] Test on mobile device
- [ ] Check all feature flags work

### 7. Monitoring

#### Worker Logs

```bash
# View real-time logs
npx wrangler tail

# View specific worker logs
npx wrangler tail whatsapp-pdf-worker
```

#### Database Queries

```bash
# Check user count
npx wrangler d1 execute whatsapp-pdf-db --command "SELECT COUNT(*) FROM users"

# Check recent orders
npx wrangler d1 execute whatsapp-pdf-db --command "SELECT * FROM orders ORDER BY created_at DESC LIMIT 10"
```

### 8. Security Hardening

- [ ] Update CORS to specific domain (remove wildcard)
- [ ] Enable rate limiting in worker
- [ ] Set up Cloudflare WAF rules
- [ ] Enable HTTPS only
- [ ] Review and rotate JWT secrets regularly

### 9. Performance Optimization

- [ ] Enable Cloudflare caching for static assets
- [ ] Optimize PDF generation for large files
- [ ] Add worker analytics
- [ ] Set up CDN for frontend assets

## Environment-Specific Configurations

### Development
```env
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8787
```

### Staging
```env
FRONTEND_URL=https://staging.yourdomain.com
NEXT_PUBLIC_API_URL=https://staging-worker.your-subdomain.workers.dev
```

### Production
```env
FRONTEND_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Rollback Procedure

If deployment fails:

```bash
# Rollback worker to previous version
npx wrangler rollback

# Rollback frontend (Vercel)
# Go to Vercel Dashboard → Deployments → Find previous deployment → Promote to Production
```

## Cost Estimates (Cloudflare Free Tier)

- Workers: 100,000 requests/day
- D1: 5GB storage, 5 million reads/day
- Pages: Unlimited requests

For higher usage, upgrade to Cloudflare paid plans.

## Support & Maintenance

### Regular Tasks
- Monitor error logs weekly
- Check database size monthly
- Review user feedback
- Update dependencies quarterly

### Backup Strategy
```bash
# Export database regularly
npx wrangler d1 execute whatsapp-pdf-db --command ".dump" > backup.sql
```
