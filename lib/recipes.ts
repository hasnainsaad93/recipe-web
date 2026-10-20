import { query } from "./db";
import { isCuisine } from "./cuisines";

export type RecipeSummary = {
  id: number;
  title: string;
  cuisine: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  author_id: number;
  author_name: string;
};

export type Recipe = RecipeSummary & {
  ingredients: string;
  steps: string;
  author_avatar: string | null;
};

const SUMMARY_COLS = `r.id, r.title, r.cuisine, r.description, r.image_url, r.created_at,
  u.id as author_id, u.name as author_name`;

export async function searchRecipes(q?: string, cuisine?: string): Promise<RecipeSummary[]> {
  const where: string[] = [];
  const params: unknown[] = [];
  if (q && q.trim()) {
    params.push(`%${q.trim()}%`);
    const p = `$${params.length}`;
    where.push(`(r.title ilike ${p} or r.description ilike ${p} or r.ingredients ilike ${p})`);
  }
  if (cuisine && isCuisine(cuisine)) {
    params.push(cuisine);
    where.push(`r.cuisine = $${params.length}`);
  }
  const sql = `select ${SUMMARY_COLS} from recipes r join users u on u.id = r.user_id
    ${where.length ? "where " + where.join(" and ") : ""}
    order by r.created_at desc limit 60`;
  return query<RecipeSummary>(sql, params);
}

export async function recipesByUser(userId: number): Promise<RecipeSummary[]> {
  return query<RecipeSummary>(
    `select ${SUMMARY_COLS} from recipes r join users u on u.id = r.user_id
     where r.user_id = $1 order by r.created_at desc`,
    [userId]
  );
}

export async function getRecipe(id: number): Promise<Recipe | null> {
  const rows = await query<Recipe>(
    `select ${SUMMARY_COLS}, r.ingredients, r.steps, u.avatar_url as author_avatar
     from recipes r join users u on u.id = r.user_id where r.id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

export type RecipeInput = {
  title: string;
  cuisine: string;
  description: string | null;
  ingredients: string;
  steps: string;
  image_url: string | null;
};

/** Validates a request body; returns either a clean input or an error message. */
export function parseRecipeInput(body: any): { data?: RecipeInput; error?: string } {
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const title = str(body?.title);
  const cuisine = str(body?.cuisine);
  const description = str(body?.description);
  const ingredients = str(body?.ingredients);
  const steps = str(body?.steps);
  const image_url = str(body?.image_url);
  if (!title || title.length > 120) return { error: "Title is required (max 120 characters)." };
  if (!isCuisine(cuisine)) return { error: "Please pick a cuisine." };
  if (!ingredients) return { error: "Ingredients are required." };
  if (!steps) return { error: "Steps are required." };
  if (description.length > 500) return { error: "Description is too long (max 500)." };
  if (image_url && !/^https?:\/\//i.test(image_url)) return { error: "Image URL must start with http(s)://" };
  return {
    data: { title, cuisine, description: description || null, ingredients, steps, image_url: image_url || null },
  };
}
