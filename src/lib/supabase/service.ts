import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Service role client — bypasses RLS.
 * ONLY use in server-side code (Server Actions, API routes).
 * NEVER import in client components or expose to the browser.
 */
export function createServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
