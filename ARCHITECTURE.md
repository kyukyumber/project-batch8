# Architecture Documentation

## Overview

This project is a full-stack Next.js application integrated with Supabase for authentication and database management. It uses the Next.js App Router for routing and Mantine UI for styling.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database & Auth:** Supabase
- **Language:** TypeScript
- **Styling:** Mantine UI (v7) + Tailwind CSS
- **Package Manager:** PNPM

## Folder Structure

```
├── app/                  # Next.js App Router directory
│   ├── (public)/         # Public routes (landing page, etc.)
│   ├── admin/            # Admin dashboard (protected)
│   ├── api/              # API Routes (health checks, etc.)
│   ├── auth/             # Authentication pages (login, callback, error)
│   ├── dashboard/        # User dashboard (protected)
│   ├── layout.tsx        # Root layout (providers, global styles)
│   └── page.tsx          # Home page
├── components/           # Reusable React components
│   ├── admin/            # Admin-specific components
│   ├── auth/             # Auth forms (login, signup)
│   └── dashboard/        # Dashboard layout components
├── lib/                  # Utility functions and configurations
│   ├── auth/             # Auth actions (Server Actions)
│   └── supabase/         # Supabase client configurations
├── database/             # SQL scripts for database setup
└── scripts/              # Utility scripts (e.g., admin setup)
```

## Data Flow & Architecture

### 1. Authentication Flow
- **Middleware (`middleware.ts`):** Intercepts every request to refresh the Supabase session and protect routes.
  - Redirects unauthenticated users from `/dashboard` or `/admin` to `/auth/login`.
  - Redirects authenticated users from auth pages to `/dashboard`.
- **Auth Actions (`lib/auth/actions.ts`):** Server Actions that handle Sign In, Sign Up, and Sign Out using the Supabase SDK.
- **Callback (`app/auth/callback/route.ts`):** Handles OAuth redirects and email confirmations. It also checks if the user's profile exists and is approved.

### 2. Database Schema (Supabase)
The application relies on two main concepts for user data:
- **`auth.users`:** Managed internally by Supabase. Stores email, encrypted password, and session data.
- **`public.profiles`:** Custom table linked to `auth.users` via `id`. Stores application-specific data like `full_name`, `role` (user/admin), and `is_approved`.

**Key Triggers:**
- A database trigger (`handle_new_user`) automatically creates a row in `public.profiles` whenever a new user is created in `auth.users`.

### 3. Security (RLS)
Row Level Security (RLS) is enabled on `public.profiles` to ensure data privacy:
- **Users:** Can only view and edit their own profile.
- **Admins:** Can view and edit all profiles (managed via a special `is_admin()` security definer function to prevent recursion).

### 4. Admin System
- **Role-based Access:** The `public.profiles` table has a `role` column.
- **Approval System:** Users can be marked as `is_approved` (boolean). Unapproved users are redirected to a "Pending Approval" page even if they have a valid session.
- **Admin Dashboard:** Located at `/admin`, allows admins to approve/reject users.

## Styling System
- **Mantine UI:** Used for complex components (Inputs, Buttons, Modals, Tables).
- **Tailwind CSS:** Used for layout and spacing utility classes.
- **Theme:** Configured in `components/providers/mantine-provider.tsx`.
