import { z } from "zod";

const isBuild = process.env.NEXT_PHASE === "phase-production-build";
const isProd = process.env.NODE_ENV === "production" && !isBuild;
const skipValidation = process.env.SKIP_ENV_VALIDATION === "true" || process.env.SKIP_ENV_VALIDATION === "1" || process.env.NODE_ENV === "test";

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: isProd ? z.string().min(1) : z.string().optional(),
  RESEND_API_KEY: isProd ? z.string().min(1) : z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  WHATSAPP_API_URL: z.string().optional(),
  WHATSAPP_API_TOKEN: z.string().optional(),
  GOOGLE_GENERATIVE_AI_API_KEY: isProd ? z.string().min(1) : z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3001"),
  NEXT_PUBLIC_RESEND_SENDER: z.string().email().optional(),
  NEXT_PUBLIC_GA4_ID: z.string().optional(),
  NEXT_PUBLIC_FB_PIXEL_ID: z.string().optional(),
  NEXT_PUBLIC_PAYMENT_PROVIDER: z.enum(["razorpay", "stripe"]).default("stripe"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_PLACES_KEY: z.string().optional(),
});

// Statically evaluate client-side env vars so Next.js compiler can inline them
const clientEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_RESEND_SENDER: process.env.NEXT_PUBLIC_RESEND_SENDER,
  NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID,
  NEXT_PUBLIC_FB_PIXEL_ID: process.env.NEXT_PUBLIC_FB_PIXEL_ID,
  NEXT_PUBLIC_PAYMENT_PROVIDER: process.env.NEXT_PUBLIC_PAYMENT_PROVIDER,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  NEXT_PUBLIC_GOOGLE_PLACES_KEY: process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY,
};

const isServer = typeof window === "undefined";

// Validate environment variables
let parsed: Record<string, unknown>;
if (skipValidation) {
  console.log("⚠️ Skipping environment variable validation because SKIP_ENV_VALIDATION is set.");
  parsed = {
    ...process.env,
    ...clientEnv,
  };
} else if (isServer) {
  const mergedSchema = serverSchema.merge(clientSchema);
  const result = mergedSchema.safeParse({
    ...process.env,
    ...clientEnv,
  });
  if (!result.success) {
    console.error("❌ Invalid server-side environment variables:", result.error.format());
    throw new Error("Invalid environment variables");
  }
  parsed = result.data;
} else {
  const result = clientSchema.safeParse(clientEnv);
  if (!result.success) {
    console.error("❌ Invalid client-side environment variables:", result.error.format());
    throw new Error("Invalid environment variables");
  }
  parsed = result.data;
}

// Proxied export to prevent client-side access to server-side variables
export const env = new Proxy(parsed, {
  get(target, prop) {
    if (typeof prop !== "string") return Reflect.get(target, prop);

    // If on client and trying to access server key, block and throw error
    if (!isServer && !prop.startsWith("NEXT_PUBLIC_") && prop !== "NODE_ENV") {
      throw new Error(
        `❌ Attempted to access server-side environment variable '${prop}' on the client.`
      );
    }
    return Reflect.get(target, prop);
  },
}) as z.infer<typeof serverSchema> & z.infer<typeof clientSchema>;
