# Database Setup Guide

## Cloudflare D1 Database

This project uses Cloudflare D1, a serverless SQLite database.

## Setup Instructions

### 1. Create D1 Database

```bash
# Login to Cloudflare
npx wrangler login

# Create database
npx wrangler d1 create whatsapp-pdf-db

# Note the database_id from the output
```

### 2. Update wrangler.toml

Add the database binding to your `worker/wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "whatsapp-pdf-db"
database_id = "YOUR_DATABASE_ID_HERE"
```

### 3. Run Migrations

```bash
# Apply schema to production
npx wrangler d1 execute whatsapp-pdf-db --file=./database/schema.sql

# Or run migration
npx wrangler d1 execute whatsapp-pdf-db --file=./database/migrations/001_initial_setup.sql
```

### 4. Local Development

```bash
# Create local database
npx wrangler d1 execute whatsapp-pdf-db --local --file=./database/schema.sql

# Test queries locally
npx wrangler d1 execute whatsapp-pdf-db --local --command "SELECT * FROM users"
```

## Schema Overview

### Tables

1. **users** - Stores authenticated user information
   - `id`: Primary key
   - `email`: User's email (unique)
   - `google_id`: Google OAuth ID (unique)
   - `subscription_tier`: 'free' or 'premium'
   - Timestamps

2. **orders** - Tracks PDF conversion orders
   - `id`: Primary key
   - `user_id`: Foreign key to users
   - `filename`: Original file name
   - `amount`: Payment amount
   - `status`: Order status (pending/completed/failed)
   - `payment_method`: Payment method used
   - `transaction_id`: Payment transaction ID
   - Timestamps

3. **sessions** - Optional session management
   - `id`: Primary key
   - `user_id`: Foreign key to users
   - `session_token`: Unique session token
   - `expires_at`: Expiration timestamp
   - Timestamps

## Privacy & Security

- **No chat content is stored** in the database
- Only user metadata and order information is persisted
- All chat files are processed in-memory and immediately discarded
- Sessions expire automatically
