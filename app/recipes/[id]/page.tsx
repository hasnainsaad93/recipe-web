/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getRecipe } from "@/lib/recipes";
import { Avatar } from "@/components/Avatar";
import { DeleteRecipeButton } from "@/components/DeleteRecipeButton";

export const dynamic = "force-dynamic";

const lines = (s: string) => s.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

export default async function RecipePage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const recipe = Number.isInteger(id) ? await getRecipe(id) : null;
  if (!recipe) notFound();
  const me = await getCurrentUser().catch(() => null);
  const isOwner = me?.id === recipe.author_id;

  return (
    <article className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      {recipe.image_url && <img src={recipe.image_url} alt={recipe.title} className="max-h-[420px] w-full object-cover" />}
      <div className="p-6 sm:p-8">
        <Link
          href={`/?cuisine=${encodeURIComponent(recipe.cuisine)}`}
          className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700 hover:bg-orange-200"
        >
          {recipe.cuisine}
        </Link>
        <h1 className="mt-3 text-3xl font-bold">{recipe.title}</h1>
        {recipe.description && <p className="mt-2 text-neutral-600">{recipe.description}</p>}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <Link href={`/users/${recipe.author_id}`} className="flex items-center gap-2 hover:underline">
            <Avatar src={recipe.author_avatar} name={recipe.author_name} size={36} />
            <span className="text-sm">
              by <span className="font-semibold">{recipe.author_name}</span>
              <span className="text-neutral-500"> · {new Date(recipe.created_at).toLocaleDateString()}</span>
            </span>
          </Link>
          {isOwner && (
            <div className="flex gap-2">
              <Link href={`/recipes/${recipe.id}/edit`} className="btn-outline">Edit</Link>
              <DeleteRecipeButton id={recipe.id} authorId={recipe.author_id} />
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_2fr]">
          <section>
            <h2 className="mb-3 text-lg font-semibold">Ingredients</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {lines(recipe.ingredients).map((l, i) => <li key={i}>{l}</li>)}
            </ul>
          </section>
          <section>
            <h2 className="mb-3 text-lg font-semibold">Steps</h2>
            <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed">
              {lines(recipe.steps).map((l, i) => <li key={i}>{l}</li>)}
            </ol>
          </section>
        </div>
      </div>
    </article>
  );
}
