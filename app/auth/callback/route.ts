import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // Check for error parameters from Supabase redirect
  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");
  const error_code = searchParams.get("error_code");

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/error?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(error_description ?? "")}&error_code=${encodeURIComponent(error_code ?? "")}`
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check approval status
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Add retry logic or error handling for profile fetch
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("is_approved")
          .eq("id", user.id)
          .single();
        
        // If profile is missing (and not due to connection error), it might be delayed.
        // But if it really doesn't exist, we should let them go to dashboard 
        // where layout will handle the missing profile (redirect to error page).
        // If we block here, we might hide the real issue.
        
        if (profile && !profile.is_approved) {
          await supabase.auth.signOut();
          return NextResponse.redirect(
            `${origin}/auth/pending-approval`
          );
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`);
}
