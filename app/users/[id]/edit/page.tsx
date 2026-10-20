import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getProfile } from "@/lib/users";
import { ProfileForm } from "@/components/ProfileForm";

export const dynamic = "force-dynamic";

export default async function EditProfilePage({ params }: { params: { id: string } }) {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (Number(params.id) !== me.id) redirect(`/users/${me.id}/edit`);
  const profile = await getProfile(me.id);
  if (!profile) redirect("/login");
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-4 text-2xl font-bold">Your profile</h1>
      <ProfileForm profile={profile} />
    </div>
  );
}
