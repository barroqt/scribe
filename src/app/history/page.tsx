import { auth } from "@/lib/auth";
import { db } from "@/db";
import { games, gameParticipants } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import HistoryClient from "./HistoryClient";

export type GameRow = {
  id: number;
  playedAt: Date | null;
  createdAt: Date | null;
  participants: {
    id: number;
    gameId: number;
    playerId: number | null;
    playerName: string;
    wonder: string;
    score: number;
    rank: number;
  }[];
};

async function getGamesWithParticipants(userId: string): Promise<GameRow[]> {
  const allGames = await db
    .select()
    .from(games)
    .where(eq(games.userId, userId))
    .orderBy(desc(games.playedAt));

  const result = await Promise.all(
    allGames.map(async (game) => {
      const participants = await db
        .select()
        .from(gameParticipants)
        .where(
          and(
            eq(gameParticipants.gameId, game.id),
            eq(gameParticipants.userId, userId)
          )
        )
        .orderBy(gameParticipants.rank);

      return { ...game, participants };
    })
  );

  return result;
}

export default async function HistoryPage() {
  const session = await auth();
  const gamesData = await getGamesWithParticipants(session?.user?.id!);
  return <HistoryClient initialGames={gamesData} />;
}
