import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { RecipeForm } from "@/components/RecipeForm";

export const dynamic = "force-dynamic";

export default async function NewRecipePage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-2xl font-bold">Share a recipe</h1>
      <RecipeForm />
    </div>
  );
}
