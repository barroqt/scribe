import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { games, gameParticipants, players, WONDERS } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/games error:", error);
    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { participants, playedAt } = body as {
      participants: { playerId: number; wonder: string; score: number }[];
      playedAt?: string;
    };

    // Validate participants count
    if (!participants || participants.length < 3 || participants.length > 7) {
      return NextResponse.json(
        { error: "A game must have between 3 and 7 players" },
        { status: 400 }
      );
    }

    // Validate each participant
    for (const p of participants) {
      if (!p.playerId || typeof p.score !== "number") {
        return NextResponse.json(
          { error: "Each participant must have a playerId and score" },
          { status: 400 }
        );
      }
      if (!WONDERS.includes(p.wonder as (typeof WONDERS)[number])) {
        return NextResponse.json(
          { error: `Invalid wonder: ${p.wonder}` },
          { status: 400 }
        );
      }
    }

    // Check for duplicate player IDs
    const playerIds = participants.map((p) => p.playerId);
    if (new Set(playerIds).size !== playerIds.length) {
      return NextResponse.json(
        { error: "Each player can only appear once per game" },
        { status: 400 }
      );
    }

    // Check for duplicate wonders
    const wonderNames = participants.map((p) => p.wonder);
    if (new Set(wonderNames).size !== wonderNames.length) {
      return NextResponse.json(
        { error: "Each wonder can only be used once per game" },
        { status: 400 }
      );
    }

    // Verify all players exist (scoped to user) and fetch their names
    const playerRecords = await Promise.all(
      playerIds.map((id) =>
        db
          .select()
          .from(players)
          .where(and(eq(players.id, id), eq(players.userId, userId)))
      )
    );
    for (let i = 0; i < playerRecords.length; i++) {
      if (playerRecords[i].length === 0) {
        return NextResponse.json(
          { error: `Player with ID ${playerIds[i]} not found` },
          { status: 404 }
        );
      }
    }

    // Build a map of playerId -> playerName
    const playerNameMap = new Map<number, string>();
    for (const records of playerRecords) {
      const p = records[0];
      playerNameMap.set(p.id, p.name);
    }

    // Calculate ranks (highest score wins, ties share rank)
    const scores = participants.map((p) => p.score);
    const sortedScores = [...scores].sort((a, b) => b - a);

    const participantsWithRank = participants.map((p) => ({
      ...p,
      rank: sortedScores.indexOf(p.score) + 1,
    }));

    // Create the game
    const gameDate = playedAt ? new Date(playedAt) : new Date();
    const [newGame] = await db
      .insert(games)
      .values({ playedAt: gameDate, userId })
      .returning();

    // Insert participants with denormalized player name
    await db.insert(gameParticipants).values(
      participantsWithRank.map((p) => ({
        gameId: newGame.id,
        userId,
        playerId: p.playerId,
        playerName: playerNameMap.get(p.playerId) ?? "Unknown",
        wonder: p.wonder,
        score: p.score,
        rank: p.rank,
      }))
    );

    return NextResponse.json(newGame, { status: 201 });
  } catch (error) {
    console.error("POST /api/games error:", error);
    return NextResponse.json({ error: "Failed to create game" }, { status: 500 });
  }
}
