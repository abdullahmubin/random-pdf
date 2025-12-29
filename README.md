# WhatsApp Chat to PDF Converter

A full-stack MVP application that converts WhatsApp chat exports (.txt files) into clean, professional, court-ready PDFs with Google SSO authentication and subscription-based access.

## 🚀 Features

- ✅ **Google SSO Authentication** - Secure sign-in with Google OAuth
- ✅ **WhatsApp Chat Parsing** - Supports both Android and iPhone export formats
- ✅ **Professional PDF Generation** - Court-ready formatting with timestamps
- ✅ **Privacy-Focused** - No chat content stored, processed in-memory only
- ✅ **Preview System** - First 10 messages preview before conversion
- ✅ **Subscription Tiers** - Free (5MB, watermark) and Premium (10MB+, no watermark)
- ✅ **Responsive UI** - Works on desktop and mobile devices
- ✅ **Feature Flags** - Environment-controlled features (blur, system messages, emojis)

## 📁 Project Structure

```
.
├── frontend/           # Next.js 14+ application
│   ├── app/           # Next.js app router pages
│   ├── components/    # React components
│   └── lib/           # Utilities and API client
│
├── worker/            # Cloudflare Worker backend
│   ├── index.js       # Main worker entry point
│   ├── parser.js      # WhatsApp chat parser
│   ├── pdfGenerator.js # PDF generation logic
│   ├── auth.js        # Authentication utilities
│   └── wrangler.toml  # Cloudflare Worker config
│
└── database/          # Cloudflare D1 database
    ├── schema.sql     # Database schema
    ├── migrations/    # SQL migrations
    └── README.md      # Database setup guide
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: JavaScript
- **Styling**: CSS Modules
- **Authentication**: Google OAuth 2.0

### Backend
- **Runtime**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **PDF Generation**: pdf-lib
- **Authentication**: JWT with Google OAuth

## 📋 Prerequisites

- Node.js 18+ installed
- Cloudflare account
- Google Cloud Console account (for OAuth)
- Wrangler CLI installed (`npm install -g wrangler`)

## 🔧 Setup Instructions

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - **Application type**: Web application
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (development)
     - `https://yourdomain.com` (production)
   - **Authorized redirect URIs**: Same as above
5. Copy the Client ID and Client Secret

### 2. Cloudflare D1 Database Setup

```bash
# Login to Cloudflare
npx wrangler login

# Create D1 database
npx wrangler d1 create whatsapp-pdf-db

# Note the database_id from output
```

Update `worker/wrangler.toml` with your database ID:
```toml
[[d1_databases]]
binding = "DB"
database_name = "whatsapp-pdf-db"
database_id = "YOUR_DATABASE_ID_HERE"
```

Run migrations:
```bash
cd worker
npx wrangler d1 execute whatsapp-pdf-db --file=../database/schema.sql
```

### 3. Worker Environment Setup

Set environment variables for the worker:

```bash
cd worker

# Set Google OAuth credentials
npx wrangler secret put GOOGLE_CLIENT_ID
# Paste your Google Client ID

npx wrangler secret put GOOGLE_CLIENT_SECRET
# Paste your Google Client Secret

# Generate and set JWT secret (use a strong random string)
npx wrangler secret put JWT_SECRET
# Paste a 32+ character random string

# Set frontend URL
npx wrangler secret put FRONTEND_URL
# Enter: http://localhost:3000 (or your production URL)
```

Install dependencies:
```bash
npm install
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Edit .env.local and add your values:
# NEXT_PUBLIC_API_URL=http://localhost:8787
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## 🚀 Running the Application

### Development

Terminal 1 - Start Cloudflare Worker:
```bash
cd worker
npm run dev
# Worker will run on http://localhost:8787
```

Terminal 2 - Start Next.js Frontend:
```bash
cd frontend
npm run dev
# Frontend will run on http://localhost:3000
```

Visit `http://localhost:3000` in your browser.

### Production Deployment

#### Deploy Worker:
```bash
cd worker
npm run deploy
# Note the deployed worker URL
```

#### Deploy Frontend (Vercel):
```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# - NEXT_PUBLIC_API_URL: Your worker URL
# - NEXT_PUBLIC_GOOGLE_CLIENT_ID: Your Google Client ID
```

## 🔐 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8787
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### Worker (Cloudflare Secrets)
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret_min_32_chars
FRONTEND_URL=http://localhost:3000

# Feature Flags (optional)
ENABLE_PREVIEW_BLUR=true
IGNORE_SYSTEM_MESSAGES=true
RENDER_EMOJIS=false
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/google` - Authenticate with Google token
- `GET /api/auth/verify` - Verify JWT token

### File Operations
- `POST /api/upload` - Validate uploaded file
- `POST /api/preview` - Get preview of first 10 messages
- `POST /api/generate-pdf` - Generate and download PDF

### User Operations
- `GET /api/user/subscription` - Get user subscription info
- `GET /api/user/orders` - Get user's order history

### Health
- `GET /api/health` - Health check endpoint

## 🎨 Feature Flags

Control features via environment variables in `worker/.env`:

- **ENABLE_PREVIEW_BLUR** (default: true) - Show only first 10 messages in preview
- **IGNORE_SYSTEM_MESSAGES** (default: true) - Filter out WhatsApp system messages
- **RENDER_EMOJIS** (default: false) - Enable emoji rendering in PDFs (requires additional fonts)

## 💳 Subscription System

### Free Tier
- Max file size: 5MB
- Watermark on PDFs
- All core features

### Premium Tier
- Max file size: 10MB+
- No watermark
- Priority support

To upgrade users, update the database:
```sql
UPDATE users SET subscription_tier = 'premium' WHERE email = 'user@example.com';
```

## 🔒 Privacy & Security

- **No chat storage**: Chat content is never stored in the database
- **In-memory processing**: Files are processed in-memory and discarded immediately
- **Secure authentication**: Google OAuth with JWT tokens
- **HTTPS only**: All production traffic over HTTPS
- **Session management**: Automatic token expiration

## 📊 Database Schema

### users
- `id`: Primary key
- `email`: User email (unique)
- `google_id`: Google OAuth ID (unique)
- `subscription_tier`: 'free' or 'premium'
- `created_at`, `updated_at`: Timestamps

### orders
- `id`: Primary key
- `user_id`: Foreign key to users
- `filename`: Original file name
- `amount`: Payment amount
- `status`: 'pending', 'completed', 'failed'
- `payment_method`: Payment method used
- `transaction_id`: Payment transaction ID
- `created_at`, `updated_at`: Timestamps

### sessions
- `id`: Primary key
- `user_id`: Foreign key to users
- `session_token`: Unique session token
- `expires_at`: Expiration timestamp
- `created_at`: Timestamp

## 🧪 Testing

Test WhatsApp chat export formats:

**Android Format:**
```
01/01/2024, 10:30 AM - John Doe: Hello World
01/01/2024, 10:31 AM - Jane Smith: Hi there!
```

**iPhone Format:**
```
[01/01/2024, 10:30:45 AM] John Doe: Hello World
[01/01/2024, 10:31:23 AM] Jane Smith: Hi there!
```

## 🐛 Troubleshooting

### Worker not starting
- Check wrangler.toml configuration
- Verify database_id is correct
- Ensure all secrets are set

### Authentication failing
- Verify Google OAuth credentials
- Check redirect URIs match
- Confirm JWT_SECRET is set

### PDF generation errors
- Check file format is valid WhatsApp export
- Verify file size within limits
- Check worker logs: `wrangler tail`

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [pdf-lib Documentation](https://pdf-lib.js.org/)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)

## 🤝 Payment Integration (For Bangladesh)

Since Stripe is not supported in Bangladesh, integrate local payment gateways:

### Recommended Options:
1. **bKash** - Most popular in Bangladesh
2. **Nagad** - Government-backed
3. **Rocket** - Dutch-Bangla Bank
4. **Manual Bank Transfer** - With verification

Add payment webhook handlers in `worker/index.js` for payment verification.

## 📄 License

MIT License - feel free to use for commercial purposes.

## 🙏 Support

For issues or questions:
1. Check troubleshooting section
2. Review worker logs with `wrangler tail`
3. Check browser console for frontend errors

---

Built with ❤️ for court-ready PDF conversion
