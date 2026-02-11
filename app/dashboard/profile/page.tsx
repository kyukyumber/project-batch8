import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileCard } from "@/components/dashboard/profile-card";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/auth/login");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal information
        </p>
      </div>
      <ProfileCard user={user} profile={profile} />
    </div>
  );
}
