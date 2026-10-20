"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteRecipeButton({ id, authorId }: { id: number; authorId: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function onDelete() {
    if (!confirm("Delete this recipe? This cannot be undone.")) return;
    setBusy(true);
    const res = await fetch(`/api/recipes/${id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      return alert(d.error ?? "Could not delete recipe.");
    }
    router.push(`/users/${authorId}`);
    router.refresh();
  }
  return (
    <button onClick={onDelete} disabled={busy} className="btn-outline border-red-300 text-red-600 hover:bg-red-50">
      {busy ? "Deleting…" : "Delete"}
    </button>
  );
}
