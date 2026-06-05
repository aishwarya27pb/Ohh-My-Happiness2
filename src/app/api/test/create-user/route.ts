import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { env } from "@/env";

export async function POST(request: Request) {
  // Only allow in development
  if (env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }

  const { email, password, firstName, lastName, phone } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY || ""
  );


  // Use Admin API to create and confirm user in one go
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name: firstName,
      last_name: lastName,
      phone: phone,
    }
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, user: data.user });
}
