import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";

// The 7 Wonders wonders list
export const WONDERS = [
  "Alexandria",
  "Babylon",
  "Ephesus",
  "Gizah",
  "Halikarnassos",
  "Olympia",
  "Rhodos",
] as const;

export type Wonder = (typeof WONDERS)[number];

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name"),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
      () => new Date()
    ),
  }
);

export const players = sqliteTable(
  "players",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
      () => new Date()
    ),
  },
  (table) => ({
    userNameUnique: uniqueIndex("players_user_name_unique").on(
      table.userId,
      table.name
    ),
  })
);

export const games = sqliteTable("games", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  playedAt: integer("played_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const gameParticipants = sqliteTable("game_participants", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  gameId: integer("game_id")
    .notNull()
    .references(() => games.id, { onDelete: "cascade" }),
  playerId: integer("player_id").references(() => players.id, {
    onDelete: "set null",
  }),
  playerName: text("player_name").notNull(),
  wonder: text("wonder").notNull(),
  score: integer("score").notNull(),
  rank: integer("rank").notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
export type GameParticipant = typeof gameParticipants.$inferSelect;
export type NewGameParticipant = typeof gameParticipants.$inferInsert;

// Computed stats types (not stored in DB, calculated on the fly)
export type PlayerStats = {
  player: Player;
  gamesPlayed: number;
  wins: number;
  winRate: number;
  avgScore: number;
  bestScore: number;
  wonderStats: WonderPlayerStats[];
};

export type WonderPlayerStats = {
  wonder: Wonder;
  gamesPlayed: number;
  wins: number;
  winRate: number;
  avgScore: number;
};

export type WonderStats = {
  wonder: Wonder;
  gamesPlayed: number;
  wins: number;
  winRate: number;
  avgScore: number;
};

export type GameWithParticipants = Game & {
  participants: GameParticipant[];
};

// Serialized versions for client components (Date -> string after JSON serialization)
export type SerializedParticipant = Omit<GameParticipant, "createdAt"> & {
  createdAt?: string | null;
};
export type SerializedGame = Omit<Game, "playedAt" | "createdAt"> & {
  playedAt: string | null;
  createdAt: string | null;
  participants: SerializedParticipant[];
};
