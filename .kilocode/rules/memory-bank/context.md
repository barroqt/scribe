# Active Context: Scribe — 7 Wonders Tracker

## Current State

**App Status**: ✅ Fully built and deployed

Scribe is a complete 7 Wonders board game tracker. Players can be enrolled, games recorded, history viewed, and stats calculated dynamically.

## Recently Completed

- [x] Drizzle ORM + SQLite (libsql via @kilocode/app-builder-db) database setup
- [x] Schema: `players`, `games`, `game_participants` tables
- [x] API routes: players CRUD, games CRUD, stats endpoint
- [x] Dark antiquity theme: Georgia serif font, #e6e0ae/#dfbc5e/#d73c37/#b51f09 palette
- [x] NavBar with active link highlighting (sticky, gold gradient top bar)
- [x] Home page with quick stats and nav cards
- [x] Players page: add/list/delete players with win stats
- [x] Add Game page: 3–7 player form, wonder/player deduplication validation
- [x] History page: all games sorted by date, delete with cascade stat recalc
- [x] Stats page: player win rates (with per-wonder breakdown), wonder win rates
- [x] Dev + production environment configuration (.env.example)

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/db/schema.ts` | Drizzle schema: players, games, game_participants | ✅ |
| `src/db/index.ts` | DB client | ✅ |
| `src/db/migrations/` | SQL migrations | ✅ |
| `src/app/api/players/` | GET all, POST create | ✅ |
| `src/app/api/players/[id]/` | DELETE player | ✅ |
| `src/app/api/games/` | GET all with participants, POST create | ✅ |
| `src/app/api/games/[id]/` | DELETE game (cascade) | ✅ |
| `src/app/api/stats/` | GET computed stats | ✅ |
| `src/app/page.tsx` | Home page (server component) | ✅ |
| `src/app/players/` | Players management | ✅ |
| `src/app/games/new/` | Add game form | ✅ |
| `src/app/history/` | Game history with delete | ✅ |
| `src/app/stats/` | Stats: players + wonders tabs | ✅ |
| `src/components/NavBar.tsx` | Sticky nav bar | ✅ |
| `src/app/globals.css` | Antiquity theme + component classes | ✅ |

## Data Model

- **Player**: id, name (unique), createdAt
- **Game**: id, playedAt, createdAt
- **GameParticipant**: id, gameId (FK cascade), playerId (FK), wonder, score, rank

## Stats Calculation

Stats are computed on-the-fly from raw game data (no denormalized stats stored). Deletion of a game automatically recalculates all derived stats on next page load.

## Wonders

Alexandria, Babylon, Ephesus, Gizah, Halikarnassos, Olympia, Rhodos (7 total)

## Session History

| Date | Changes |
|------|---------|
| 2026-04-16 | Built entire Scribe app from Next.js template |
| 2026-06-25 | Added local dev DB proxy (scripts/db-proxy.ts), .env for local DB_URL/DB_TOKEN, db:proxy script |
