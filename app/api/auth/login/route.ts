import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";
import { clientIp, resetAttempts, tooManyAttempts } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const emailKey = `login:email:${email}`;
    const ipKey = `login:ip:${clientIp(req.headers)}`;

    const limitedEmail = tooManyAttempts(emailKey);
    const limitedIp = tooManyAttempts(ipKey);
    if (limitedEmail || limitedIp) {
      return NextResponse.json({ error: "Too many sign-in attempts. Try again in 15 minutes." }, { status: 429 });
    }

    const rows = await query<{ id: number; password_hash: string }>(
      "select id, password_hash from users where email = $1",
      [email]
    );
    const user = rows[0];
    const ok = user ? await bcrypt.compare(password, user.password_hash) : false;
    if (!user || !ok) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    resetAttempts(emailKey);
    const res = NextResponse.json({ id: user.id });
    setSessionCookie(res, req, user.id);
    return res;
  } catch (e: any) {
    console.error(e);
    const msg = String(e?.message ?? "");
    const config = msg.includes("DATABASE_URL") || msg.includes("SESSION_SECRET");
    return NextResponse.json({ error: config ? msg : "Sign in failed. Please try again." }, { status: 500 });
  }
}
