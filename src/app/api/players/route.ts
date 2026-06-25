import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { players } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const allPlayers = await db
      .select()
      .from(players)
      .where(eq(players.userId, userId))
      .orderBy(players.name);
    return NextResponse.json(allPlayers);
  } catch (error) {
    console.error("GET /api/players error:", error);
    return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 });
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
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Player name is required" }, { status: 400 });
    }

    const trimmedName = name.trim();

    // Check for duplicate (unique per user)
    const existing = await db
      .select()
      .from(players)
      .where(
        and(eq(players.userId, userId), eq(players.name, trimmedName))
      );

    if (existing.length > 0) {
      return NextResponse.json({ error: "A player with this name already exists" }, { status: 409 });
    }

    const [newPlayer] = await db
      .insert(players)
      .values({ name: trimmedName, userId })
      .returning();

    return NextResponse.json(newPlayer, { status: 201 });
  } catch (error) {
    console.error("POST /api/players error:", error);
    return NextResponse.json({ error: "Failed to create player" }, { status: 500 });
  }
}
