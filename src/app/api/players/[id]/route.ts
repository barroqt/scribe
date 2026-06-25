import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { players } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const playerId = parseInt(id, 10);

    if (isNaN(playerId)) {
      return NextResponse.json({ error: "Invalid player ID" }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(players)
      .where(and(eq(players.id, playerId), eq(players.userId, userId)));

    if (existing.length === 0) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    await db.delete(players).where(eq(players.id, playerId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/players/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete player" }, { status: 500 });
  }
}
