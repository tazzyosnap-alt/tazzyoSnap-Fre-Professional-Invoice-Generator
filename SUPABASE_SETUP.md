# Supabase Setup Guide for TazzyoSnap

## 🚀 Quick Setup Steps

### 1. Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign in with GitHub
3. Click "New Project"
4. Choose organization
5. Project name: `TazzyoSnap Invoice Generator`
6. Database password: (choose strong password)
7. Region: `Southeast Asia (Singapore)` or `Asia Pacific (Tokyo)`
8. Click "Create new project"

### 2. Setup Database Schema
1. Go to **SQL Editor** in Supabase Dashboard
2. Click **"New Query"**
3. Copy and paste the contents of `supabase/schema.sql`
4. Click **"Run"** to execute the schema

### 3. Get API Keys
1. Go to **Settings** → **API**
2. Copy **Project URL** (looks like: `https://xxxxx.supabase.co`)
3. Copy **anon public** key (starts with: `eyJ...`)

### 4. Configure Environment Variables

#### For Local Development:
1. Copy `client/env.example` to `client/.env.local`
2. Replace the values:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### For Vercel Deployment:
1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GA_MEASUREMENT_ID`

### 5. Test Connection
1. Run `npm run dev`
2. Open browser console
3. Check for any Supabase connection errors
4. Try creating an invoice to test database connection

## 📊 Database Schema Overview

### Tables Created:
- **users** - User accounts (for future authentication)
- **invoices** - Invoice data storage
- **invoice_templates** - Pre-built templates
- **analytics** - Usage tracking

### Features:
- **UUID primary keys** - Secure, unique identifiers
- **JSONB for flexible data** - Invoice items stored as JSON
- **Timestamps** - Automatic created_at/updated_at
- **Soft deletes** - is_deleted flag instead of hard deletes
- **Indexes** - Optimized for performance

## 🔧 Available Functions

### Invoice Service:
```typescript
import { invoiceService } from '@/lib/supabase-client'

// Save invoice
const savedInvoice = await invoiceService.saveInvoice(invoiceData)

// Get invoices
const invoices = await invoiceService.getInvoices()

// Delete invoice
await invoiceService.deleteInvoice(invoiceId)
```

### Analytics Service:
```typescript
import { analyticsService } from '@/lib/supabase-client'

// Track events
await analyticsService.trackPDFGeneration('INV-001')
await analyticsService.trackSignatureCreated()
await analyticsService.trackInvoiceCreated()
```

### Template Service:
```typescript
import { templateService } from '@/lib/supabase-client'

// Get templates
const templates = await templateService.getTemplates()

// Save template
await templateService.saveTemplate('Custom Template', 'Description', templateData)
```

## 🔒 Security & Permissions

### Row Level Security (RLS):
- **Public access** for templates (read-only)
- **Authenticated access** for invoices (when user system is added)
- **Analytics** are public for tracking

### API Security:
- **Anon key** is safe for client-side use
- **Service role key** should be server-side only
- **Environment variables** protect sensitive data

## 📈 Monitoring & Analytics

### Built-in Analytics:
- **PDF Generation** tracking
- **Signature Creation** tracking
- **Invoice Creation** tracking
- **User Agent** and **IP** tracking

### Supabase Dashboard:
- **Database** - View tables and data
- **Logs** - Monitor API calls
- **Metrics** - Track usage and performance

## 🚨 Troubleshooting

### Common Issues:

1. **Connection Error:**
   - Check environment variables
   - Verify Supabase URL format
   - Ensure project is not paused

2. **Schema Error:**
   - Run SQL schema again
   - Check for duplicate tables
   - Verify extensions are enabled

3. **Permission Error:**
   - Check RLS policies
   - Verify anon key permissions
   - Review API access settings

### Support:
- **Supabase Docs:** https://supabase.com/docs
- **Community:** https://github.com/supabase/supabase/discussions
- **Discord:** https://discord.supabase.com

## 🎯 Next Steps

1. **Authentication** - Add user login system
2. **Templates** - Create default invoice templates
3. **Analytics Dashboard** - View usage statistics
4. **API Endpoints** - Create REST API for external access
5. **Backup Strategy** - Set up automated backups

---

**Ready to go! Your Supabase integration is now complete.** 🎉
