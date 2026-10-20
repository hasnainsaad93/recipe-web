# RecipeShare

A simple recipe-sharing app where users sign up, create a profile, and share recipes that appear under their profile.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL
- **Database driver:** `pg` with parameterized SQL
- **Authentication:** Custom session with `bcryptjs` password hashing and `jsonwebtoken` signed httpOnly cookies

## Features
- Sign up / sign in / sign out (email + password, bcrypt hashes, signed httpOnly session cookie, rate-limited sign-in)
- Profiles with name, bio and avatar URL, listing every recipe the user shared
- Create, edit and delete recipes (title, cuisine, description, ingredients, steps, image URL).
  Only the author can edit or delete — enforced in the API (`where id = $1 and user_id = <session user>`)
- Public home page with keyword search and cuisine filter (dropdown + chips) — no login needed
- Recipe detail page linking to the author's profile

## Run
```
npm install
npm run dev
```

## Environment
See `.env.example`. Set these in the workspace Secrets panel:
- `DATABASE_URL` – Postgres connection string
- `SESSION_SECRET` – long random string for signing session cookies

The schema lives in `db/migrations/` (tables `users` and `recipes`).

## Structure
- `app/` – pages and API route handlers (`app/api/auth/*`, `app/api/recipes/*`, `app/api/profile`)
- `components/` – UI components
- `lib/` – db pool, auth/session, recipe & user queries, rate limiter

## Notes
The spec suggested Prisma + Auth.js; to keep the MVP small and dependency-light this uses `pg` with
parameterized SQL and a minimal JWT-cookie session instead. Images are added by URL (no upload service).
