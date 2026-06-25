# Active Context: Scribe — 7 Wonders Tracker

## Current State

**App Status**: ✅ Fully built and deployed

Scribe is a complete 7 Wonders board game tracker with authentication and per-user data isolation.

## Recently Completed

- [x] Authentication: NextAuth v5 with email/password credentials
- [x] User registration API + register page
- [x] Login page with CSRF-protected sign-in
- [x] Route protection via proxy.ts (redirects unauthenticated users to /login)
- [x] Multi-tenancy: `userId` column added to `players`, `games`, `game_participants`
- [x] All API routes and pages scoped by logged-in user
- [x] NavBar shows user email and sign-out button when authenticated
- [x] Schema: added `users` table (id, email, password, name, createdAt)
- [x] DB driver: switched to `drizzle-orm/sqlite-proxy` with local Bun proxy
- [x] Local dev: `scripts/db-proxy.ts` using `bun:sqlite`, auto-applies migrations

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/db/schema.ts` | Drizzle schema: users, players, games, game_participants | ✅ |
| `src/db/index.ts` | DB client (sqlite-proxy via HTTP) | ✅ |
| `src/db/migrations/` | SQL migrations (3 files, incl. auth + userId) | ✅ |
| `scripts/db-proxy.ts` | Local Bun SQLite proxy server | ✅ |
| `src/lib/auth.ts` | NextAuth v5 config with credentials provider | ✅ |
| `src/proxy.ts` | Route protection middleware | ✅ |
| `src/components/SessionProvider.tsx` | NextAuth SessionProvider wrapper | ✅ |
| `src/app/login/page.tsx` | Login page | ✅ |
| `src/app/register/page.tsx` | Registration page | ✅ |
| `src/app/api/auth/[...nextauth]/` | NextAuth API routes | ✅ |
| `src/app/api/auth/register/` | Registration API | ✅ |
| `src/app/api/players/` | GET all (scoped), POST create | ✅ |
| `src/app/api/players/[id]/` | DELETE (scoped) | ✅ |
| `src/app/api/games/` | GET all (scoped), POST create | ✅ |
| `src/app/api/games/[id]/` | DELETE (scoped) | ✅ |
| `src/app/api/stats/` | GET computed stats (scoped) | ✅ |
| `src/app/page.tsx` | Home page with user-scoped stats | ✅ |
| `src/app/players/` | Players management (scoped) | ✅ |
| `src/app/games/new/` | Add game form (scoped) | ✅ |
| `src/app/history/` | Game history (scoped) | ✅ |
| `src/app/stats/` | Stats: players + wonders tabs (scoped) | ✅ |
| `src/components/NavBar.tsx` | Nav bar with auth UI | ✅ |
| `src/app/globals.css` | Antiquity theme + component classes | ✅ |

## Data Model

- **User**: id (UUID), email (unique), password (hashed), name, createdAt
- **Player**: id, userId (FK), name (unique per user), createdAt
- **Game**: id, userId (FK), playedAt, createdAt
- **GameParticipant**: id, userId (FK), gameId (FK cascade), playerId (FK), playerName, wonder, score, rank

## Stats Calculation

Stats are computed on-the-fly from raw game data (no denormalized stats stored). All queries are scoped to the authenticated user.

## Wonders

Alexandria, Babylon, Ephesus, Gizah, Halikarnassos, Olympia, Rhodos (7 total)

## Session History

| Date | Changes |
|------|---------|
| 2026-04-16 | Built entire Scribe app from Next.js template |
| 2026-06-25 | Added auth + multi-tenancy + local dev proxy + @libsql/client attempt then settled on sqlite-proxy |
