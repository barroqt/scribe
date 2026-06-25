# 7 Wonders Game Tracker

Track your 7 Wonders board game sessions, calculate player and wonder win rates, and settle debates about which wonder is truly OP.

## Features

- **Player stats** — Win rate, average score, best score per player, broken down by wonder
- **Wonder stats** — Which wonders win most often, average scores per wonder
- **Game history** — Full record of every game with scores and rankings
- **User accounts** — Each user gets their own isolated data (sign up, sign in)

## Tech Stack

Next.js 16, React 19, TypeScript, Tailwind CSS 4, Drizzle ORM, SQLite (via libsql), NextAuth v5

## Local Development

```bash
# Install dependencies
bun install

# Set up env vars
cp .env.example .env
# Edit .env — AUTH_SECRET can be any random string for local dev

# Create SQLite database and run migrations
bun run db:migrate

# Start the dev server
bun dev
```

Open http://localhost:3000, create an account, and start tracking.

## Deployment

This app uses Turso (managed SQLite) for the database in production. See instructions to deploy to Vercel + Turso:

1. `turso db create <name>`
2. Save URL and token to Vercel environment variables (`AUTH_SECRET`, `DB_URL`, `DB_TOKEN`)
3. Run `bun run db:migrate` against Turso
4. Deploy to Vercel from your Git repo
