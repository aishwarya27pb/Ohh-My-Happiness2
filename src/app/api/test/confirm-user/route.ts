import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { env } from "@/env";

export async function POST(request: Request) {
  // Only allow in development
  if (env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }

  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY || ""
  );


  // 1. List users to find the user by email
  const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 });
  }

  const user = listData.users.find((u) => u.email === email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 2. Update email_confirm status
  const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
    email_confirm: true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, user: data.user });
}
