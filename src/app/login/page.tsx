"use client";

import { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, FormEvent } from "react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <div className="flex items-center justify-center pt-16">
      <div className="scribe-card w-full max-w-md">
        <h1 className="page-title text-center mb-6" style={{ fontSize: "1.3rem" }}>
          Sign In
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="scribe-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="scribe-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="scribe-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="scribe-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button
            type="submit"
            className="scribe-btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-4" style={{ color: "#6a6860", fontSize: "0.85rem" }}>
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            style={{ color: "#dfbc5e", textDecoration: "underline" }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center pt-16">
        <div className="scribe-card w-full max-w-md">
          <p className="text-center" style={{ color: "#6a6860" }}>Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
