import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getProfile } from "@/lib/users";
import { recipesByUser } from "@/lib/recipes";
import { Avatar } from "@/components/Avatar";
import { RecipeGrid } from "@/components/RecipeCard";

export const dynamic = "force-dynamic";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const profile = await getProfile(Number(params.id));
  if (!profile) notFound();
  const [recipes, me] = await Promise.all([recipesByUser(profile.id), getCurrentUser().catch(() => null)]);
  const isMe = me?.id === profile.id;

  return (
    <div>
      <section className="mb-8 flex flex-col items-center gap-4 rounded-xl border border-neutral-200 bg-white p-6 text-center shadow-sm sm:flex-row sm:text-left">
        <Avatar src={profile.avatar_url} name={profile.name} size={88} />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          {profile.bio && <p className="mt-1 whitespace-pre-wrap text-neutral-600">{profile.bio}</p>}
          <p className="mt-2 text-xs text-neutral-500">
            {recipes.length} recipe{recipes.length === 1 ? "" : "s"} · Joined{" "}
            {new Date(profile.created_at).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
          </p>
        </div>
        {isMe && (
          <div className="flex gap-2">
            <Link href={`/users/${profile.id}/edit`} className="btn-outline">Edit profile</Link>
            <Link href="/recipes/new" className="btn">+ New recipe</Link>
          </div>
        )}
      </section>

      <h2 className="mb-4 text-lg font-semibold">{isMe ? "Your recipes" : `Recipes by ${profile.name}`}</h2>
      <RecipeGrid
        recipes={recipes}
        showAuthor={false}
        empty={isMe ? <p>You haven&apos;t shared any recipes yet. <Link href="/recipes/new" className="text-orange-600 hover:underline">Share your first one</Link>.</p> : <p>No recipes shared yet.</p>}
      />
    </div>
  );
}
