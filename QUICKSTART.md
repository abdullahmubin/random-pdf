# 🚀 Quick Start Guide

Get the WhatsApp Chat to PDF Converter running in 10 minutes!

## Prerequisites

- Node.js 18+ installed
- Cloudflare account (free tier works)
- Google Cloud account (free)

## Step 1: Google OAuth Setup (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "WhatsApp PDF Converter"
3. Enable **Google+ API**
4. Create OAuth 2.0 credentials:
   - Type: **Web application**
   - Name: "WhatsApp PDF Converter"
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000`
5. **Copy the Client ID** (looks like: `123456789.apps.googleusercontent.com`)

## Step 2: Cloudflare Setup (3 minutes)

```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
npx wrangler login

# Create D1 database
cd worker
npx wrangler d1 create whatsapp-pdf-db
```

**Copy the database_id** from the output (looks like: `abcd1234-5678-90ef-ghij-klmnopqrstuv`)

Edit `worker/wrangler.toml` and add your database_id:
```toml
database_id = "YOUR_DATABASE_ID_HERE"
```

Apply database schema:
```bash
npx wrangler d1 execute whatsapp-pdf-db --file=../database/schema.sql
```

## Step 3: Worker Configuration (2 minutes)

Still in the `worker` directory:

```bash
# Install dependencies (if not already done)
npm install

# Set Google Client ID
npx wrangler secret put GOOGLE_CLIENT_ID
# Paste your Google Client ID

# Set Google Client Secret (from Google Cloud Console)
npx wrangler secret put GOOGLE_CLIENT_SECRET
# Paste your Google Client Secret

# Generate JWT secret (copy this random string)
npx wrangler secret put JWT_SECRET
# Generate a random 32+ character string or use: openssl rand -base64 32

# Set frontend URL
npx wrangler secret put FRONTEND_URL
# Enter: http://localhost:3000
```

## Step 4: Frontend Configuration (1 minute)

```bash
cd ../frontend

# Copy environment template
cp .env.local.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8787
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
```

Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Google Client ID.

## Step 5: Start the Application

**Terminal 1 - Start Worker:**
```bash
cd worker
npm run dev
```

Wait for: `⛅️ wrangler 3.x.x`  
Worker running at: `http://localhost:8787`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

Wait for: `- ready started server on 0.0.0.0:3000`  
Frontend running at: `http://localhost:3000`

## Step 6: Test the Application

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. Click "Continue with Google"
3. Sign in with your Google account
4. Upload a WhatsApp chat export file (use `sample-chat.txt` in the repo)
5. Preview the messages
6. Click "Download PDF"
7. Success! 🎉

## Sample WhatsApp Chat File

Create `sample-chat.txt` with this content to test:

```
01/01/2024, 10:00 AM - John Doe: Hey, how are you?
01/01/2024, 10:01 AM - Jane Smith: I'm good, thanks! How about you?
01/01/2024, 10:02 AM - John Doe: Doing great! Want to meet up later?
01/01/2024, 10:05 AM - Jane Smith: Sure! What time?
01/01/2024, 10:06 AM - John Doe: How about 3 PM at the coffee shop?
01/01/2024, 10:07 AM - Jane Smith: Perfect! See you then 😊
01/01/2024, 10:08 AM - John Doe: Great! See you soon
```

## Troubleshooting

### Worker Won't Start
- Check `wrangler.toml` has correct database_id
- Verify all secrets are set: `npx wrangler secret list`

### Frontend Can't Connect
- Ensure worker is running on port 8787
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`

### Google Sign-In Fails
- Verify Client ID in `.env.local` matches Google Console
- Check authorized origins include `http://localhost:3000`
- Clear browser cookies and try again

### Database Errors
- Re-run schema: `npx wrangler d1 execute whatsapp-pdf-db --file=../database/schema.sql`
- Check binding name is "DB" in wrangler.toml

## Next Steps

1. Read [README.md](README.md) for full documentation
2. See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
3. Customize the UI in `frontend/components/`
4. Add payment integration for subscriptions

## Getting Help

- Check worker logs: `npx wrangler tail`
- Check browser console (F12) for frontend errors
- Review [README.md](README.md) for detailed docs

---

**Time to build:** ~10 minutes  
**Time to first PDF:** ~30 seconds  

Happy coding! 🚀
