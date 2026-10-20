import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { parseRecipeInput } from "@/lib/recipes";

type Ctx = { params: { id: string } };

// Only the author may edit/delete: every write filters by id AND user_id from the session.
export async function PUT(req: NextRequest, { params }: Ctx) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const id = Number(params.id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const { data, error } = parseRecipeInput(await req.json().catch(() => ({})));
  if (!data) return NextResponse.json({ error }, { status: 400 });

  const rows = await query(
    `update recipes set title = $1, cuisine = $2, description = $3, ingredients = $4,
       steps = $5, image_url = $6, updated_at = now()
     where id = $7 and user_id = $8 returning id`,
    [data.title, data.cuisine, data.description, data.ingredients, data.steps, data.image_url, id, me.id]
  );
  if (!rows.length) return NextResponse.json({ error: "Recipe not found or not yours." }, { status: 403 });
  return NextResponse.json({ id });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const id = Number(params.id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const rows = await query("delete from recipes where id = $1 and user_id = $2 returning id", [id, me.id]);
  if (!rows.length) return NextResponse.json({ error: "Recipe not found or not yours." }, { status: 403 });
  return NextResponse.json({ ok: true });
}
