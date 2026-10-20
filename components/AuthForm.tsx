"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const form = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(data.error ?? "Something went wrong.");
    router.push(mode === "signup" ? `/users/${data.id}/edit` : "/");
    router.refresh();
  }

  const isSignup = mode === "signup";
  return (
    <div className="mx-auto max-w-sm rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-bold">{isSignup ? "Create your account" : "Welcome back"}</h1>
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        {isSignup && (
          <div>
            <label className="label" htmlFor="name">Name</label>
            <input id="name" name="name" required maxLength={60} className="input" />
          </div>
        )}
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="input" autoComplete="email" />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={isSignup ? 8 : undefined}
            className="input"
            autoComplete={isSignup ? "new-password" : "current-password"}
          />
          {isSignup && <p className="mt-1 text-xs text-neutral-500">At least 8 characters.</p>}
        </div>
        {error && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
        <button className="btn w-full" disabled={busy}>
          {busy ? "Please wait…" : isSignup ? "Sign up" : "Sign in"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-neutral-600">
        {isSignup ? (
          <>Already have an account? <Link href="/login" className="text-orange-600 hover:underline">Sign in</Link></>
        ) : (
          <>New here? <Link href="/signup" className="text-orange-600 hover:underline">Create an account</Link></>
        )}
      </p>
    </div>
  );
}
