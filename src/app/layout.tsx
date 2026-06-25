import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Scribe — 7 Wonders Tracker",
  description: "Track your 7 Wonders board game statistics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <SessionProvider>
          <NavBar />
          <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
            {children}
          </main>
          <footer className="text-center py-4 text-sm" style={{ color: "#4a4840", borderTop: "1px solid #2a2820" }}>
            <span style={{ color: "#dfbc5e" }}>✦</span> Scribe &mdash; 7 Wonders Tracker <span style={{ color: "#dfbc5e" }}>✦</span>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
