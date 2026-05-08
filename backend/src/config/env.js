import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  SUPABASE_URL: z.string().url().default("https://dev-placeholder.supabase.co"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).default("dev-placeholder-service-role-key"),
  CMS_API_KEY: z.string().min(16).default("cms-local-demo-key-mx-2026"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  CORS_ORIGINS: z.string().optional(),
  SIGNUP_REDIRECT_URL: z.string().url().optional()
});

const parsed = envSchema.parse(process.env);

export const env = {
  ...parsed,
  corsOrigins: (parsed.CORS_ORIGINS ?? parsed.CORS_ORIGIN)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
};
