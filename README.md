# Portfolio + Supabase CMS

This portfolio now uses Supabase as the backend for dynamic content and lead management.

## What is dynamic now

- Projects
- Services
- Testimonials
- FAQs
- Blog articles
- Contact messages
- Call bookings
- Image uploads (Supabase Storage)

The frontend fetches these from Supabase using `@supabase/supabase-js` via `src/services/api.js`.

## 1) Create Supabase project

1. Go to Supabase dashboard and create a new project.
2. In Project Settings -> API, copy:
- Project URL
- Anon public key

## 2) Configure environment variables

Copy `.env.example` into `.env` and set values:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_SUPABASE_STORAGE_BUCKET=portfolio-assets
```

## 3) Create tables and policies

Run the SQL file below in Supabase SQL Editor:

- `supabase/schema.sql`

This script creates:
- all content tables
- lead tables (`messages`, `bookings`)
- RLS policies
- storage bucket + policies

## 4) Create admin user (for authenticated writes)

In Supabase dashboard:

1. Go to Authentication -> Users
2. Create a user (email/password)
3. Use those credentials for admin login in the app

## 5) Run locally

```bash
npm install
npm run dev
```

## 6) Seed initial content (recommended)

After schema creation, insert your initial projects/services/blogs/etc in Supabase Table Editor.
Without seed data, fallback demo content in `src/App.jsx` is shown until Supabase data is available.

## Notes

- Public users can read published content and submit forms.
- Only authenticated users can modify content and storage files.
- Image upload uses bucket: `portfolio-assets` (or `VITE_SUPABASE_STORAGE_BUCKET`).
