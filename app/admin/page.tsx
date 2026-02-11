import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminUserTable } from "@/components/admin/admin-user-table";

export default async function AdminPage() {
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

  if (!profile || profile.role !== "admin") redirect("/dashboard");

  // Fetch all users (admin can see all via RLS policy)
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Approve or manage user accounts. Users who sign in with Google need approval before they can access the app.
        </p>
      </div>
      <AdminUserTable users={users || []} currentUserId={user.id} />
    </div>
  );
}
