# Frontend README

## Next.js Frontend Application

User-facing web application for WhatsApp Chat to PDF conversion.

## Quick Start

```bash
npm install
cp .env.local.example .env.local
# Edit .env.local with your values
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8787
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

## Key Features

- Google SSO Authentication
- Drag & Drop File Upload
- Chat Preview (first 10 messages)
- PDF Download
- Responsive Design
- Subscription Tier Support

## Project Structure

```
app/          - Pages and layouts
components/   - Reusable UI components
lib/          - Utilities and API client
```

## Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm start        # Start production server
```

## Deployment

Deploy to Vercel or Cloudflare Pages. See [DEPLOYMENT.md](../DEPLOYMENT.md) for details.
