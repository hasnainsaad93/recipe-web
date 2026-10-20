import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";
import { clientIp, tooManyAttempts } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const name = String(body.name ?? "").trim();

    if (tooManyAttempts(`signup:${clientIp(req.headers)}`)) {
      return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }
    if (Buffer.byteLength(password, "utf8") > 72) {
      // bcrypt silently truncates beyond 72 bytes
      return NextResponse.json({ error: "Password must be at most 72 characters." }, { status: 400 });
    }
    if (!name || name.length > 60) {
      return NextResponse.json({ error: "Name is required (max 60 characters)." }, { status: 400 });
    }

    const existing = await query("select id from users where email = $1", [email]);
    if (existing.length) {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }
    const hash = await bcrypt.hash(password, 10);
    const rows = await query<{ id: number }>(
      "insert into users (email, password_hash, name) values ($1, $2, $3) returning id",
      [email, hash, name]
    );
    const res = NextResponse.json({ id: rows[0].id });
    setSessionCookie(res, req, rows[0].id);
    return res;
  } catch (e: any) {
    if (e?.code === "23505") {
      // unique violation on email (concurrent signup)
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }
    console.error(e);
    const msg = String(e?.message ?? "");
    const config = msg.includes("DATABASE_URL") || msg.includes("SESSION_SECRET");
    return NextResponse.json({ error: config ? msg : "Sign up failed. Please try again." }, { status: 500 });
  }
}
