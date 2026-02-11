import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import readline from "readline";

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "\x1b[31m%s\x1b[0m",
    "Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function setupAdmin() {
  console.log("\n🚀 \x1b[36mSupabase Admin Setup Wizard\x1b[0m\n");

  const email = await question("Enter Admin Email: ");
  const password = await question("Enter Admin Password (min 6 chars): ");
  const fullName = await question("Enter Admin Full Name: ");

  if (password.length < 6) {
    console.error("\x1b[31m%s\x1b[0m", "Error: Password must be at least 6 characters.");
    rl.close();
    process.exit(1);
  }

  console.log("\n⏳ Creating user...");

  // 1. Create User
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto confirm
    user_metadata: {
      full_name: fullName,
    },
  });

  if (authError) {
    console.error("\x1b[31m%s\x1b[0m", `Error creating user: ${authError.message}`);
    rl.close();
    process.exit(1);
  }

  const userId = authData.user.id;
  console.log(`✅ User created (ID: ${userId})`);

  // 2. Wait a bit for the trigger to run (create profile)
  // Although trigger is fast, sometimes it takes a few ms.
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("⏳ Promoting to admin...");

  // 3. Update Profile to Admin & Approve
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      role: "admin",
      is_approved: true,
    })
    .eq("id", userId);

  if (profileError) {
    console.error("\x1b[31m%s\x1b[0m", `Error updating profile: ${profileError.message}`);
    console.log(
      "Tip: Make sure you have applied the schema.sql and RLS policies correctly."
    );
  } else {
    console.log("\n🎉 \x1b[32mSuccess! Admin account is ready.\x1b[0m");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("You can now log in at /auth/login");
  }

  rl.close();
}

setupAdmin();
