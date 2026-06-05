import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { env } from "@/env";

/**
 * Service role client — bypasses RLS.
 * ONLY use in server-side code (Server Actions, API routes).
 * NEVER import in client components or expose to the browser.
 */
export function createServiceClient() {
  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

