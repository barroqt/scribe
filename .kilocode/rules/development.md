# Development Rules

## Critical Rules

- **Package manager**: Use `bun` (not npm/yarn)
- **Never run** `next dev` or `bun dev` - the sandbox handles this automatically
- **Always commit and push** after completing changes:
  ```bash
  bun typecheck && bun lint && git add -A && git commit -m "descriptive message" && git push
  ```

## Commands

| Command | Purpose |
|---------|---------|
| `bun install` | Install dependencies |
| `bun dev` | Start dev server (need db:proxy first) |
| `bun build` | Build production app |
| `bun lint` | Check code quality |
| `bun typecheck` | Type checking |
| `bun run db:proxy` | Start local SQLite proxy (port 3001) |
| `bun run db:generate` | Generate new migration from schema |
| `bun run db:migrate` | Run pending migrations |
| `bun run db:push` | Push schema directly (dev only) |

## Best Practices

### React/Next.js
- Use Server Components by default; add `"use client"` only when needed
- Use `next/image` for optimized images
- Use `next/link` for client-side navigation
- Use `error.tsx` for error boundaries
- Use `not-found.tsx` for 404 pages

### API Routes
- Return `NextResponse.json({ error: "..." }, { status: 500 })` on failure
- Always include appropriate status codes
- Handle errors gracefully

### Code Quality
- Run `bun typecheck` before committing
- Run `bun lint` before committing
- Write descriptive commit messages
