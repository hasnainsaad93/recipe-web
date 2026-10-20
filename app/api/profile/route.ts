import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

// Update the signed-in user's own profile.
export async function PATCH(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const name = String(body.name ?? "").trim();
  const bio = String(body.bio ?? "").trim();
  const avatar = String(body.avatar_url ?? "").trim();

  if (!name || name.length > 60) return NextResponse.json({ error: "Name is required (max 60)." }, { status: 400 });
  if (bio.length > 300) return NextResponse.json({ error: "Bio is too long (max 300)." }, { status: 400 });
  if (avatar && !/^https?:\/\//i.test(avatar))
    return NextResponse.json({ error: "Avatar URL must start with http(s)://" }, { status: 400 });

  await query("update users set name = $1, bio = $2, avatar_url = $3 where id = $4", [
    name,
    bio || null,
    avatar || null,
    me.id,
  ]);
  return NextResponse.json({ ok: true, id: me.id });
}
