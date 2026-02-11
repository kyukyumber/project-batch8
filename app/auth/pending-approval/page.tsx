import { Clock } from "lucide-react";
import Link from "next/link";

export default function PendingApprovalPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: "hsl(var(--warning) / 0.1)" }}>
            <Clock className="h-7 w-7" style={{ color: "hsl(var(--warning))" }} />
          </div>
          <h1 className="text-xl font-bold text-foreground">
            Account Pending Approval
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Your account has been created successfully, but it needs to be
            approved by an administrator before you can access the application.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            You will be able to sign in once your account has been approved.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-block rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
