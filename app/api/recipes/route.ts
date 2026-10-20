import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { parseRecipeInput, searchRecipes } from "@/lib/recipes";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? undefined;
  const cuisine = req.nextUrl.searchParams.get("cuisine") ?? undefined;
  try {
    return NextResponse.json(await searchRecipes(q, cuisine));
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Search failed." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const { data, error } = parseRecipeInput(await req.json().catch(() => ({})));
  if (!data) return NextResponse.json({ error }, { status: 400 });

  const rows = await query<{ id: number }>(
    `insert into recipes (user_id, title, cuisine, description, ingredients, steps, image_url)
     values ($1, $2, $3, $4, $5, $6, $7) returning id`,
    [me.id, data.title, data.cuisine, data.description, data.ingredients, data.steps, data.image_url]
  );
  return NextResponse.json({ id: rows[0].id }, { status: 201 });
}
