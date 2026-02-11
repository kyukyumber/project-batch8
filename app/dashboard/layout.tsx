import React from "react"
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    console.error("Dashboard Layout Profile Error:", error);
    // If user exists but profile is missing, it's a data integrity issue.
    // Redirecting to login would cause a loop because middleware sees a valid user.
    // Instead, redirect to an error page or sign-out.
    const errorDetails = error ? JSON.stringify(error) : "No profile data returned";
    redirect(`/auth/error?error=missing_profile&details=${encodeURIComponent(errorDetails)}`);
  }

  return (
    <DashboardShell user={user} profile={profile}>
      {children}
    </DashboardShell>
  );
}
