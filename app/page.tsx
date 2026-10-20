import Link from "next/link";
import { CUISINES } from "@/lib/cuisines";
import { searchRecipes, type RecipeSummary } from "@/lib/recipes";
import { RecipeGrid } from "@/components/RecipeCard";

export const dynamic = "force-dynamic";

type Props = { searchParams: { q?: string; cuisine?: string } };

export default async function Home({ searchParams }: Props) {
  const q = searchParams.q ?? "";
  const cuisine = searchParams.cuisine ?? "";
  let recipes: RecipeSummary[] = [];
  let error: string | null = null;
  try {
    recipes = await searchRecipes(q, cuisine);
  } catch (e: any) {
    error = e?.message ?? "Could not load recipes.";
  }

  const chipHref = (c: string) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (c) p.set("cuisine", c);
    const s = p.toString();
    return s ? `/?${s}` : "/";
  };

  return (
    <div>
      <section className="mb-8 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Find your next favorite dish</h1>
        <p className="mt-2 text-neutral-600">Search recipes shared by home cooks, filtered by cuisine.</p>
        <form method="get" action="/" className="mx-auto mt-6 flex max-w-2xl flex-col gap-2 sm:flex-row">
          <input name="q" defaultValue={q} placeholder="Search by keyword, e.g. pasta, chicken…" className="input flex-1" />
          <select name="cuisine" defaultValue={cuisine} className="input sm:w-48">
            <option value="">All cuisines</option>
            {CUISINES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button className="btn" type="submit">Search</button>
        </form>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {["", ...CUISINES].map((c) => (
            <Link
              key={c || "all"}
              href={chipHref(c)}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                c === cuisine ? "border-orange-600 bg-orange-600 text-white" : "border-neutral-300 bg-white hover:bg-orange-50"
              }`}
            >
              {c || "All"}
            </Link>
          ))}
        </div>
      </section>

      {error ? (
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>
      ) : (
        <>
          <p className="mb-4 text-sm text-neutral-500">
            {recipes.length} recipe{recipes.length === 1 ? "" : "s"}
            {cuisine && ` in ${cuisine}`}
            {q && ` matching “${q}”`}
          </p>
          <RecipeGrid recipes={recipes} empty={<p>No recipes found. Try another search — or share one!</p>} />
        </>
      )}
    </div>
  );
}
