import { query } from "./db";

export type PublicProfile = {
  id: number;
  name: string;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
};

// Never select email/password_hash for public pages.
export async function getProfile(id: number): Promise<PublicProfile | null> {
  if (!Number.isInteger(id)) return null;
  const rows = await query<PublicProfile>(
    "select id, name, bio, avatar_url, created_at from users where id = $1",
    [id]
  );
  return rows[0] ?? null;
}
