# 🗄️ Supabase Database Schema Setup

## 📋 ขั้นตอนการตั้งค่า Database Schema

### 1. ไปที่ Supabase Dashboard
- เปิด [https://app.supabase.com](https://app.supabase.com)
- เลือก Project ของคุณ

### 2. เปิด SQL Editor
- คลิก **SQL Editor** ในเมนูด้านซ้าย
- คลิก **"New query"**

### 3. คัดลอกและรัน Schema
คัดลอกโค้ดด้านล่างและวางใน SQL Editor:

```sql
-- TazzyoSnap Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for authentication)
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices table
CREATE TABLE invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL,
    date DATE NOT NULL,
    due_date DATE NOT NULL,
    
    -- From details
    from_name TEXT,
    from_email TEXT,
    from_address TEXT,
    from_city TEXT,
    from_postal_code TEXT,
    from_country TEXT,
    from_logo TEXT,
    
    -- To details
    to_name TEXT,
    to_email TEXT,
    to_address TEXT,
    to_city TEXT,
    to_postal_code TEXT,
    to_country TEXT,
    
    -- Invoice items (JSON format)
    items JSONB NOT NULL DEFAULT '[]',
    
    -- Totals
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    
    -- Currency
    currency TEXT DEFAULT 'USD',
    
    -- Additional information
    notes TEXT,
    terms TEXT,
    
    -- Signature
    signature_name TEXT,
    signature_image TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates table (for future use)
CREATE TABLE templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    template_name TEXT NOT NULL,
    template_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table (for tracking)
CREATE TABLE analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_name TEXT NOT NULL,
    event_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_created_at ON invoices(created_at);
CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_analytics_event_name ON analytics(event_name);
CREATE INDEX idx_analytics_created_at ON analytics(created_at);
```

### 4. รัน SQL
- คลิก **"Run"** หรือกด `Ctrl+Enter`
- ควรเห็นข้อความ "Success" หรือ "Query executed successfully"

### 5. ตั้งค่า Row Level Security (RLS)
รัน SQL ต่อไปนี้:

```sql
-- Enable RLS on all tables
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for invoices table
CREATE POLICY "Users can only see their own invoices" ON invoices
    FOR ALL USING (auth.uid() = user_id);

-- Create policies for templates table
CREATE POLICY "Users can only see their own templates" ON templates
    FOR ALL USING (auth.uid() = user_id);

-- Create policies for analytics table
CREATE POLICY "Users can only see their own analytics" ON analytics
    FOR ALL USING (auth.uid() = user_id);
```

### 6. ตรวจสอบ Tables
- ไปที่ **Table Editor**
- ควรเห็น tables: `users`, `invoices`, `templates`, `analytics`

## ✅ เสร็จสิ้น!
Database schema พร้อมใช้งานแล้ว!
