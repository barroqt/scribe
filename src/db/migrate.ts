import { migrate } from "drizzle-orm/sqlite-proxy/migrator";
import { db } from "./index";
import type { ProxyMigrator } from "drizzle-orm/sqlite-proxy/migrator";

const runMigration: ProxyMigrator = async (queries) => {
  for (const sql of queries) {
    await db.run(sql);
  }
};

await migrate(db, runMigration, {
  migrationsFolder: "./src/db/migrations",
});
