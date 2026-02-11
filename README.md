# Supabase + Next.js Boilerplate

A production-ready full-stack boilerplate featuring Next.js 14 (App Router), Supabase (Auth, DB, RLS), and Mantine UI.

## Features

- **Authentication:** Email/Password & Google OAuth.
- **Authorization:** Role-based access (User vs Admin) & Row Level Security (RLS).
- **Admin Dashboard:** Manage users and approvals.
- **Modern Stack:** Next.js 14, TypeScript, Mantine UI v7, Tailwind CSS.

## Getting Started

### 1. Prerequisites
- Node.js 18+
- PNPM (`npm install -g pnpm`)

### 2. Setup Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard) and create a new project.
2. Go to **Project Settings > API**.
3. Copy the **Project URL** and **anon public** key.

### 3. Configure Environment Variables
Copy the example file and fill in your keys:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the details:

```env
# From Supabase Dashboard > Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# REQUIRED only for running the admin setup script (DO NOT expose to client)
# From Supabase Dashboard > Project Settings > API > service_role key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Your app URL (http://localhost:3000 for dev)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Initialize Database
1. Go to **Supabase Dashboard > SQL Editor**.
2. Open the file `database/schema.sql` from this repository.
3. Copy the entire content and paste it into the Supabase SQL Editor.
4. Click **Run**.
   *This will create the profiles table, triggers, and secure RLS policies.*

### 5. Create Admin Account
Instead of manually editing the database, use the included script to create your first admin user:

```bash
npm run setup:admin
# or
pnpm setup:admin
```

Follow the prompts to enter email and password. This will:
- Create the user in Supabase Auth.
- Automatically promote them to `admin`.
- Approve their account.

### 6. Run the App

```bash
pnpm dev
```

Visit `http://localhost:3000` and login with your new admin account.

## Documentation

For detailed architecture and folder structure, see [ARCHITECTURE.md](./ARCHITECTURE.md).
