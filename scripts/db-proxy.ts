import { Database } from "bun:sqlite";
import { readdirSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "..", "scribe.local.db");
const MIGRATIONS_DIR = join(__dirname, "..", "src", "db", "migrations");

const db = new Database(DB_PATH);
db.run("PRAGMA journal_mode=WAL");
db.run("PRAGMA foreign_keys=ON");

function applyMigrations() {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const existing = new Set(
    db
      .prepare("SELECT name FROM sqlite_master WHERE type='table'")
      .all()
      .map((r) => (r as { name: string }).name)
  );

  for (const file of files) {
    const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf-8");
    const statements = sql
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter(Boolean);

    for (const stmt of statements) {
      try {
        db.run(stmt);
      } catch (e) {
        // Table may already exist, skip
      }
    }
  }
}

applyMigrations();

Bun.serve({
  port: 3001,
  async fetch(request) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const { sql, params, method } = await request.json();

    try {
      const stmt = db.prepare(sql);
      let rows: unknown[] | unknown[][] = [];

      switch (method) {
        case "run": {
          stmt.run(...(params ?? []));
          break;
        }
        case "get": {
          const all = stmt.values(...(params ?? []));
          rows = all.length > 0 ? all[0] : (null as unknown as unknown[]);
          break;
        }
        case "all":
        case "values": {
          rows = stmt.values(...(params ?? []));
          break;
        }
      }

      return Response.json({ rows });
    } catch (error) {
      return Response.json(
        { error: { message: (error as Error).message } },
        { status: 500 }
      );
    }
  },
});

console.log("Local DB proxy running on http://localhost:3001");
