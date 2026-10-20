/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { RecipeSummary } from "@/lib/recipes";

export function RecipeCard({ recipe, showAuthor = true }: { recipe: RecipeSummary; showAuthor?: boolean }) {
  return (
    <article className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/recipes/${recipe.id}`}>
        {recipe.image_url ? (
          <img src={recipe.image_url} alt={recipe.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center bg-orange-100 text-5xl">🍲</div>
        )}
      </Link>
      <div className="p-4">
        <span className="inline-block rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
          {recipe.cuisine}
        </span>
        <h3 className="mt-2 font-semibold leading-snug">
          <Link href={`/recipes/${recipe.id}`} className="hover:underline">
            {recipe.title}
          </Link>
        </h3>
        {recipe.description && <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{recipe.description}</p>}
        {showAuthor && (
          <p className="mt-2 text-xs text-neutral-500">
            by{" "}
            <Link href={`/users/${recipe.author_id}`} className="font-medium text-neutral-700 hover:underline">
              {recipe.author_name}
            </Link>
          </p>
        )}
      </div>
    </article>
  );
}

export function RecipeGrid({ recipes, showAuthor = true, empty }: { recipes: RecipeSummary[]; showAuthor?: boolean; empty: React.ReactNode }) {
  if (!recipes.length) return <div className="rounded-xl bg-white px-6 py-16 text-center text-neutral-500">{empty}</div>;
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((r) => (
        <RecipeCard key={r.id} recipe={r} showAuthor={showAuthor} />
      ))}
    </div>
  );
}
