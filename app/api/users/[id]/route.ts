import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/users";
import { recipesByUser } from "@/lib/recipes";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  try {
    const profile = await getProfile(id);
    if (!profile) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    const recipes = await recipesByUser(id);
    return NextResponse.json({ profile, recipes });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e?.message ?? "Could not load profile." }, { status: 500 });
  }
}
