import { auth } from "@/lib/auth";
import { db } from "@/db";
import { players } from "@/db/schema";
import { eq } from "drizzle-orm";
import AddGameClient from "./AddGameClient";

export default async function AddGamePage() {
  const session = await auth();
  const allPlayers = await db
    .select()
    .from(players)
    .where(eq(players.userId, session?.user?.id!))
    .orderBy(players.name);
  return <AddGameClient players={allPlayers} />;
}
