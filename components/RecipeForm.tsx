"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CUISINES } from "@/lib/cuisines";

type Initial = {
  id?: number;
  title?: string;
  cuisine?: string;
  description?: string | null;
  ingredients?: string;
  steps?: string;
  image_url?: string | null;
};

export function RecipeForm({ initial = {} }: { initial?: Initial }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const editing = !!initial.id;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const body = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch(editing ? `/api/recipes/${initial.id}` : "/api/recipes", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(data.error ?? "Could not save recipe.");
    router.push(`/recipes/${data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="title">Title</label>
          <input id="title" name="title" required maxLength={120} defaultValue={initial.title} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="cuisine">Cuisine</label>
          <select id="cuisine" name="cuisine" required defaultValue={initial.cuisine ?? ""} className="input">
            <option value="" disabled>Choose…</option>
            {CUISINES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="label" htmlFor="description">Short description (optional)</label>
        <input id="description" name="description" maxLength={500} defaultValue={initial.description ?? ""} className="input" />
      </div>
      <div>
        <label className="label" htmlFor="ingredients">Ingredients (one per line)</label>
        <textarea id="ingredients" name="ingredients" required rows={6} defaultValue={initial.ingredients} className="input" />
      </div>
      <div>
        <label className="label" htmlFor="steps">Steps (one per line)</label>
        <textarea id="steps" name="steps" required rows={8} defaultValue={initial.steps} className="input" />
      </div>
      <div>
        <label className="label" htmlFor="image_url">Image URL (optional)</label>
        <input id="image_url" name="image_url" type="url" placeholder="https://…" defaultValue={initial.image_url ?? ""} className="input" />
      </div>
      {error && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
      <div className="flex gap-2">
        <button className="btn" disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : "Share recipe"}</button>
        <button type="button" className="btn-outline" onClick={() => router.back()}>Cancel</button>
      </div>
    </form>
  );
}
