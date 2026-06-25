import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { games, gameParticipants, players, WONDERS } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { PlayerStats, WonderStats, WonderPlayerStats } from "@/db/schema";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all data needed for stats calculation, scoped to user
    const allPlayers = await db
      .select()
      .from(players)
      .where(eq(players.userId, userId))
      .orderBy(players.name);
    const allParticipants = await db
      .select()
      .from(gameParticipants)
      .where(eq(gameParticipants.userId, userId));
    const allGames = await db
      .select()
      .from(games)
      .where(eq(games.userId, userId));

    // Calculate player stats
    const playerStats: PlayerStats[] = allPlayers.map((player) => {
      const playerParticipations = allParticipants.filter(
        (p) => p.playerId === player.id
      );

      const gamesPlayed = playerParticipations.length;
      const wins = playerParticipations.filter((p) => p.rank === 1).length;
      const winRate = gamesPlayed > 0 ? (wins / gamesPlayed) * 100 : 0;
      const avgScore =
        gamesPlayed > 0
          ? playerParticipations.reduce((sum, p) => sum + p.score, 0) /
            gamesPlayed
          : 0;
      const bestScore =
        gamesPlayed > 0
          ? Math.max(...playerParticipations.map((p) => p.score))
          : 0;

      // Per-wonder stats for this player
      const wonderStats: WonderPlayerStats[] = WONDERS.map((wonder) => {
        const wonderParticipations = playerParticipations.filter(
          (p) => p.wonder === wonder
        );
        const wGamesPlayed = wonderParticipations.length;
        const wWins = wonderParticipations.filter((p) => p.rank === 1).length;
        return {
          wonder,
          gamesPlayed: wGamesPlayed,
          wins: wWins,
          winRate: wGamesPlayed > 0 ? (wWins / wGamesPlayed) * 100 : 0,
          avgScore:
            wGamesPlayed > 0
              ? wonderParticipations.reduce((sum, p) => sum + p.score, 0) /
                wGamesPlayed
              : 0,
        };
      }).filter((ws) => ws.gamesPlayed > 0);

      return {
        player,
        gamesPlayed,
        wins,
        winRate,
        avgScore,
        bestScore,
        wonderStats,
      };
    });

    // Calculate wonder stats (global, not per-player)
    const wonderStats: WonderStats[] = WONDERS.map((wonder) => {
      const wonderParticipations = allParticipants.filter(
        (p) => p.wonder === wonder
      );
      const gamesPlayed = wonderParticipations.length;
      const wins = wonderParticipations.filter((p) => p.rank === 1).length;
      return {
        wonder,
        gamesPlayed,
        wins,
        winRate: gamesPlayed > 0 ? (wins / gamesPlayed) * 100 : 0,
        avgScore:
          gamesPlayed > 0
            ? wonderParticipations.reduce((sum, p) => sum + p.score, 0) /
              gamesPlayed
            : 0,
      };
    });

    return NextResponse.json({
      playerStats,
      wonderStats,
      totalGames: allGames.length,
      totalPlayers: allPlayers.length,
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
