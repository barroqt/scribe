# Technical Context: Scribe — 7 Wonders Tracker

## Technology Stack

| Technology   | Version | Purpose                         |
| ------------ | ------- | ------------------------------- |
| Next.js      | 16.x    | React framework with App Router |
| React        | 19.x    | UI library                      |
| TypeScript   | 5.9.x   | Type-safe JavaScript            |
| Tailwind CSS | 4.x     | Utility-first CSS               |
| Bun          | Latest  | Package manager & runtime       |
| Drizzle ORM  | 0.45.x  | SQLite ORM                      |
| NextAuth     | 5.x     | Authentication (credentials)    |
| bcryptjs     | 3.x     | Password hashing                |

## Development Environment

### Prerequisites

- Bun installed (`curl -fsSL https://bun.sh/install | bash`)

### Commands

```bash
bun install              # Install dependencies
bun run db:proxy &       # Start local SQLite proxy (background)
bun dev                  # Start dev server (http://localhost:3000)
bun build                # Production build
bun start                # Start production server
bun lint                 # Run ESLint
bun typecheck            # Run TypeScript type checking
bun run db:generate      # Generate new migration from schema
bun run db:migrate       # Run pending migrations
bun run db:push          # Push schema directly (dev only)
```

## Project Configuration

### Next.js Config (`next.config.ts`)

- App Router enabled
- Default settings for flexibility

### TypeScript Config (`tsconfig.json`)

- Strict mode enabled
- Path alias: `@/*` → `src/*`
- Target: ES2017
- `scripts/` directory excluded (uses bun:sqlite)

### Tailwind CSS 4 (`postcss.config.mjs`)

- Uses `@tailwindcss/postcss` plugin
- CSS-first configuration (v4 style)

### ESLint (`eslint.config.mjs`)

- Uses `eslint-config-next`
- Flat config format

## Key Dependencies

### Production Dependencies

```json
{
  "bcryptjs": "^3.0.3",
  "drizzle-orm": "^0.45.2",
  "next": "^16.1.3",
  "next-auth": "^5.0.0-beta.31",
  "react": "^19.2.3",
  "react-dom": "^19.2.3"
}
```

### Dev Dependencies

```json
{
  "@types/bun": "^1.3.14",
  "@types/bcryptjs": "^3.0.0",
  "@types/node": "^24.10.2",
  "@types/react": "^19.2.7",
  "@types/react-dom": "^19.2.3",
  "drizzle-kit": "^0.31.10",
  "eslint": "^9.39.1",
  "eslint-config-next": "^16.0.0",
  "tailwindcss": "^4.1.17",
  "typescript": "^5.9.3"
}
```

## File Structure

```
/
├── scripts/
│   └── db-proxy.ts           # Local SQLite HTTP proxy (runs on port 3001)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts   # NextAuth handler
│   │   │   ├── auth/register/route.ts         # Registration API
│   │   │   ├── games/route.ts & [id]/route.ts
│   │   │   ├── players/route.ts & [id]/route.ts
│   │   │   └── stats/route.ts
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── games/new/page.tsx + AddGameClient.tsx
│   │   ├── history/page.tsx + HistoryClient.tsx
│   │   ├── players/page.tsx + PlayersClient.tsx
│   │   ├── stats/page.tsx + StatsClient.tsx
│   │   ├── layout.tsx, page.tsx, globals.css
│   │   └── favicon.ico
│   ├── components/
│   │   ├── NavBar.tsx
│   │   └── SessionProvider.tsx
│   ├── db/
│   │   ├── index.ts, schema.ts, migrate.ts
│   │   └── migrations/
│   ├── lib/
│   │   └── auth.ts           # NextAuth v5 config
│   └── proxy.ts              # Route protection (Next.js 16 proxy convention)
```

## Architecture

### Database Access

Uses `drizzle-orm/sqlite-proxy` — server components and API routes communicate with SQLite via an HTTP proxy:

- **Local dev**: `scripts/db-proxy.ts` (Bun process with `bun:sqlite`, runs on :3001)
- **Production**: Set `DB_URL` to a compatible HTTP endpoint

### Authentication

NextAuth v5 with JWT session strategy and credentials provider:
- Passwords hashed with bcryptjs (12 rounds)
- Users stored in local `users` table
- Sessions managed via JWT tokens in cookies
- Protected routes redirect to `/login`

### Multi-tenancy

All data tables (`players`, `games`, `game_participants`) have a `userId` foreign key. Every API query and server component filters by the authenticated user's ID, ensuring complete data isolation.

## Environment Variables

```env
# Required for production
AUTH_SECRET=your-secret-key          # NextAuth JWT encryption
DB_URL=http://localhost:3001         # Database proxy URL
DB_TOKEN=any-value                   # Auth token (checked but can be dummy locally)

# Production (when using Turso/libsql directly):
# DB_URL=libsql://your-db.turso.io
# DB_TOKEN=your-turso-token
```

## Deployment Considerations

For production deployment, the sqlite-proxy approach requires a running database endpoint. Options:
1. Deploy the Bun proxy as a sidecar alongside Next.js
2. Replace `src/db/index.ts` to use `@libsql/client` with remote Turso
3. Use a hosted SQLite HTTP API compatible with the proxy protocol
