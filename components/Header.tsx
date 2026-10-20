import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";
import { Avatar } from "./Avatar";

export async function Header() {
  const me = await getCurrentUser().catch(() => null);
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-orange-600">
          🍳 RecipeShare
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          {me ? (
            <>
              <Link href="/recipes/new" className="btn">
                + New recipe
              </Link>
              <Link href={`/users/${me.id}`} className="flex items-center gap-2 hover:underline">
                <Avatar src={me.avatar_url} name={me.name} size={28} />
                <span className="hidden sm:inline">{me.name}</span>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="btn-outline">
                Sign in
              </Link>
              <Link href="/signup" className="btn">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
