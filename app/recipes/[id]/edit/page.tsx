import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getRecipe } from "@/lib/recipes";
import { RecipeForm } from "@/components/RecipeForm";

export const dynamic = "force-dynamic";

export default async function EditRecipePage({ params }: { params: { id: string } }) {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  const id = Number(params.id);
  const recipe = Number.isInteger(id) ? await getRecipe(id) : null;
  if (!recipe) notFound();
  if (recipe.author_id !== me.id) redirect(`/recipes/${id}`);
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-2xl font-bold">Edit recipe</h1>
      <RecipeForm initial={recipe} />
    </div>
  );
}
