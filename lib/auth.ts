import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import { query } from "./db";

export const SESSION_COOKIE = "session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionUser = { id: number; email: string; name: string; avatar_url: string | null };

function secret(): string | null {
  return process.env.SESSION_SECRET || null;
}

export function signSession(userId: number): string {
  const s = secret();
  if (!s) throw new Error("SESSION_SECRET is not set. Add it in the workspace Secrets panel.");
  return jwt.sign({ uid: userId }, s, { expiresIn: MAX_AGE });
}

function isHttps(req: NextRequest): boolean {
  const proto = req.headers.get("x-forwarded-proto");
  if (proto) return proto.split(",")[0].trim() === "https";
  return req.nextUrl.protocol === "https:";
}

export function setSessionCookie(res: NextResponse, req: NextRequest, userId: number) {
  res.cookies.set(SESSION_COOKIE, signSession(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps(req),
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function clearSessionCookie(res: NextResponse, req: NextRequest) {
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps(req),
    path: "/",
    maxAge: 0,
  });
}

/** Reads the signed session cookie and loads the user. Returns null when signed out. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const s = secret();
  if (!token || !s) return null;
  try {
    const payload = jwt.verify(token, s) as { uid?: number };
    if (!payload.uid) return null;
    const rows = await query<SessionUser>(
      "select id, email, name, avatar_url from users where id = $1",
      [payload.uid]
    );
    return rows[0] ?? null;
  } catch {
    return null;
  }
}
