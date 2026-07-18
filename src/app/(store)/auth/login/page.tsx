import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";
import { Suspense } from "react";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams;
  const nextPath = params.next ?? "/";

  // Check active session on the server side - instantaneous!
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect(nextPath);
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF9EE]" />}>
      <LoginForm />
    </Suspense>
  );
}
