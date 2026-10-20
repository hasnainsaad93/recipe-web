"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PublicProfile } from "@/lib/users";

export function ProfileForm({ profile }: { profile: PublicProfile }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const body = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(data.error ?? "Could not save profile.");
    router.push(`/users/${profile.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div>
        <label className="label" htmlFor="name">Name</label>
        <input id="name" name="name" required maxLength={60} defaultValue={profile.name} className="input" />
      </div>
      <div>
        <label className="label" htmlFor="bio">Bio (optional)</label>
        <textarea id="bio" name="bio" rows={3} maxLength={300} defaultValue={profile.bio ?? ""} className="input" placeholder="Tell people what you love to cook" />
      </div>
      <div>
        <label className="label" htmlFor="avatar_url">Avatar image URL (optional)</label>
        <input id="avatar_url" name="avatar_url" type="url" placeholder="https://…" defaultValue={profile.avatar_url ?? ""} className="input" />
      </div>
      {error && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
      <div className="flex gap-2">
        <button className="btn" disabled={busy}>{busy ? "Saving…" : "Save profile"}</button>
        <button type="button" className="btn-outline" onClick={() => router.push(`/users/${profile.id}`)}>Skip</button>
      </div>
    </form>
  );
}
