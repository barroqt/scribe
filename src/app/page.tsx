import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { players, games } from "@/db/schema";
import { eq } from "drizzle-orm";

async function getHomeStats(userId: string) {
  const [allPlayers, allGames] = await Promise.all([
    db.select().from(players).where(eq(players.userId, userId)),
    db.select().from(games).where(eq(games.userId, userId)),
  ]);
  return {
    totalPlayers: allPlayers.length,
    totalGames: allGames.length,
  };
}

export default async function HomePage() {
  const session = await auth();
  const stats = await getHomeStats(session?.user?.id!);

  return (
    <div className="flex flex-col items-center gap-10">
      {/* Hero */}
      <div className="text-center pt-8 pb-4">
        <div style={{ color: "#dfbc5e", fontSize: "3rem", marginBottom: "0.5rem" }}>𓂀</div>
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "3rem",
            fontWeight: "bold",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#e6e0ae",
            marginBottom: "0.5rem",
          }}
        >
          Scribe
        </h1>
        <p
          style={{
            color: "#dfbc5e",
            fontFamily: "Georgia, serif",
            fontSize: "0.9rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}
        >
          ✦ &nbsp; 7 Wonders Game Tracker &nbsp; ✦
        </p>
        <div
          style={{
            width: "180px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, #dfbc5e, transparent)",
            margin: "1rem auto 0",
          }}
        />
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <div className="scribe-card text-center">
          <div
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "#dfbc5e",
              fontFamily: "Georgia, serif",
              lineHeight: 1,
            }}
          >
            {stats.totalGames}
          </div>
          <div style={{ color: "#aaa8a0", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "0.375rem" }}>
            Games Played
          </div>
        </div>
        <div className="scribe-card text-center">
          <div
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "#dfbc5e",
              fontFamily: "Georgia, serif",
              lineHeight: 1,
            }}
          >
            {stats.totalPlayers}
          </div>
          <div style={{ color: "#aaa8a0", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "0.375rem" }}>
            Players Enrolled
          </div>
        </div>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 gap-4 w-full max-w-2xl sm:grid-cols-2">
        <Link href="/games/new" style={{ textDecoration: "none" }}>
          <div
            className="scribe-card"
            style={{ cursor: "pointer", transition: "all 0.2s", borderColor: "#dfbc5e" }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>⚔</div>
            <div style={{ color: "#dfbc5e", fontWeight: "bold", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.9rem", marginBottom: "0.375rem" }}>
              Record a Game
            </div>
            <div style={{ color: "#6a6860", fontSize: "0.8rem" }}>
              Log the results of your last 7 Wonders session
            </div>
          </div>
        </Link>

        <Link href="/players" style={{ textDecoration: "none" }}>
          <div className="scribe-card" style={{ cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>𓁻</div>
            <div style={{ color: "#dfbc5e", fontWeight: "bold", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.9rem", marginBottom: "0.375rem" }}>
              Manage Players
            </div>
            <div style={{ color: "#6a6860", fontSize: "0.8rem" }}>
              Add or view players in your group
            </div>
          </div>
        </Link>

        <Link href="/history" style={{ textDecoration: "none" }}>
          <div className="scribe-card" style={{ cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📜</div>
            <div style={{ color: "#dfbc5e", fontWeight: "bold", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.9rem", marginBottom: "0.375rem" }}>
              Game History
            </div>
            <div style={{ color: "#6a6860", fontSize: "0.8rem" }}>
              Browse all past games and delete entries
            </div>
          </div>
        </Link>

        <Link href="/stats" style={{ textDecoration: "none" }}>
          <div className="scribe-card" style={{ cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>⚖</div>
            <div style={{ color: "#dfbc5e", fontWeight: "bold", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.9rem", marginBottom: "0.375rem" }}>
              Statistics
            </div>
            <div style={{ color: "#6a6860", fontSize: "0.8rem" }}>
              Player winrates, wonder performance, and more
            </div>
          </div>
        </Link>
      </div>

      {/* Flavour text */}
      <p
        style={{
          color: "#4a4840",
          fontStyle: "italic",
          fontFamily: "Georgia, serif",
          fontSize: "0.85rem",
          textAlign: "center",
          maxWidth: "400px",
        }}
      >
        &ldquo;Let the annals of civilization record every triumph and defeat.&rdquo;
      </p>
    </div>
  );
}
