# 🚀 Supabase Setup Guide สำหรับ TazzyoSnap

## 📋 ขั้นตอนการตั้งค่า Supabase

### 1. สร้าง Supabase Project
1. ไปที่ [https://app.supabase.com](https://app.supabase.com)
2. สมัครสมาชิกหรือเข้าสู่ระบบ
3. คลิก **"New Project"**
4. กรอกข้อมูล:
   - **Name**: `TazzyoSnap-Invoice`
   - **Database Password**: ตั้งรหัสผ่านที่แข็งแรง
   - **Region**: เลือกที่ใกล้ที่สุด (Singapore หรือ Tokyo)
5. คลิก **"Create new project"**

### 2. รอให้ Project สร้างเสร็จ
- ใช้เวลาประมาณ 2-3 นาที
- เมื่อเสร็จแล้วจะเห็น Dashboard

### 3. รับ API Keys
1. ไปที่ **Settings** → **API**
2. คัดลอก:
   - **Project URL** (เริ่มต้นด้วย `https://`)
   - **anon public key** (เริ่มต้นด้วย `eyJ`)

### 4. ตั้งค่า Environment Variables
1. สร้างไฟล์ `.env.local` ในโฟลเดอร์รากของโปรเจค
2. เพิ่มเนื้อหาดังนี้:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```
3. แทนที่ `your-project-id` และ `your-supabase-anon-key-here` ด้วยค่าจริง

### 5. ตั้งค่า Database Schema
1. ไปที่ **SQL Editor** ใน Supabase Dashboard
2. คัดลอกโค้ดจากไฟล์ `supabase/schema.sql`
3. วางและคลิก **"Run"**

### 6. ตั้งค่า Authentication
1. ไปที่ **Authentication** → **Settings**
2. เปิด **"Enable email confirmations"** (ถ้าต้องการ)
3. ตั้งค่า **Site URL**: `http://localhost:5000`
4. ตั้งค่า **Redirect URLs**: `http://localhost:5000/auth/callback`

### 7. ตั้งค่า Row Level Security (RLS)
1. ไปที่ **Table Editor**
2. เลือกตาราง `invoices`
3. ไปที่ **Policies** tab
4. สร้าง policy ใหม่:
   - **Name**: `Users can only see their own invoices`
   - **Policy**: `auth.uid() = user_id`

### 8. รีสตาร์ท Development Server
```bash
npm run dev
```

## ✅ การทดสอบ
1. เปิดเว็บไซต์ที่ `http://localhost:5000`
2. ลองกดปุ่ม **"Sign In"**
3. สมัครสมาชิกใหม่
4. ลองสร้าง Invoice และกด **"Save Invoice"**

## 🔧 การแก้ไขปัญหา
- หากยังเห็น "Demo Mode" ให้ตรวจสอบ `.env.local`
- หากไม่สามารถสมัครสมาชิกได้ ให้ตรวจสอบ Authentication settings
- หากไม่สามารถบันทึก Invoice ได้ ให้ตรวจสอบ RLS policies

## 📞 ความช่วยเหลือ
หากมีปัญหาสามารถดูได้ที่:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Community](https://github.com/supabase/supabase/discussions)
