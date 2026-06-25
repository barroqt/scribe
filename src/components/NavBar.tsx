"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/players", label: "Players" },
  { href: "/games/new", label: "Add Game" },
  { href: "/history", label: "History" },
  { href: "/stats", label: "Stats" },
];

export default function NavBar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header
      style={{
        background: "linear-gradient(180deg, #0f0e0c 0%, #1a1916 100%)",
        borderBottom: "1px solid #3a3830",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Top decorative bar */}
      <div
        style={{
          height: "2px",
          background: "linear-gradient(90deg, transparent, #dfbc5e 20%, #e6e0ae 50%, #dfbc5e 80%, transparent)",
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div className="flex items-center gap-2">
            <span style={{ color: "#dfbc5e", fontSize: "1.4rem" }}>𓂀</span>
            <span
              style={{
                color: "#e6e0ae",
                fontFamily: "Georgia, serif",
                fontWeight: "bold",
                fontSize: "1.25rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Scribe
            </span>
            <span style={{ color: "#4a4840", fontFamily: "Georgia, serif", fontSize: "0.75rem", marginLeft: "0.25rem" }}>
              VII Wonders
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${pathname === item.href ? "active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth */}
          {session?.user ? (
            <div className="flex items-center gap-2">
              <span
                style={{
                  color: "#aaa8a0",
                  fontSize: "0.8rem",
                  fontFamily: "Georgia, serif",
                }}
              >
                {session.user.name || session.user.email}
              </span>
              <button
                onClick={() => signOut()}
                className="scribe-btn-ghost"
                style={{ padding: "0.25rem 0.6rem", fontSize: "0.75rem" }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/login" className="scribe-btn-primary" style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem" }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
