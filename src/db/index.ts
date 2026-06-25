import { drizzle } from "drizzle-orm/sqlite-proxy";
import * as schema from "./schema";

const url = process.env.DB_URL ?? "http://localhost:3001";
const token = process.env.DB_TOKEN ?? "";

export const db = drizzle(
  async (sql, params, method) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params, method }),
    });

    if (!response.ok) {
      const err = (await response.json()) as { error?: { message?: string } };
      throw new Error(err.error?.message || "Query failed");
    }

    const result = (await response.json()) as { rows: unknown[] };
    return { rows: result.rows };
  },
  { schema }
);
