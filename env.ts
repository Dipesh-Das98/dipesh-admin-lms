import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    BACKEND_API_URL: z.string().url(),
    AUTH_SECRET: z.string(),
    NEXTAUTH_URL: z.string().url(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string(),
    NEXT_PUBLIC_BACKEND_URL: z.string().url().optional(),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  runtimeEnv: {
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
  },
});
