import { auth } from "@/lib/auth";
import { db } from "@/db";
import { players, gameParticipants } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import PlayersClient from "./PlayersClient";

async function getPlayersWithGameCount(userId: string) {
  const allPlayers = await db
    .select()
    .from(players)
    .where(eq(players.userId, userId))
    .orderBy(players.name);
  const playersWithCount = await Promise.all(
    allPlayers.map(async (player) => {
      const participations = await db
        .select()
        .from(gameParticipants)
        .where(
          and(
            eq(gameParticipants.playerId, player.id),
            eq(gameParticipants.userId, userId)
          )
        );
      const wins = participations.filter((p) => p.rank === 1).length;
      return {
        ...player,
        gamesPlayed: participations.length,
        wins,
      };
    })
  );
  return playersWithCount;
}

export default async function PlayersPage() {
  const session = await auth();
  const data = await getPlayersWithGameCount(session?.user?.id!);
  return <PlayersClient initialPlayers={data} />;
}
