import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          try {
            // Call backend API for admin login
            const response = await fetch(`${process.env.BACKEND_API_URL}/auth/admin/login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email,
                password,
              }),
            });

            const result = await response.json();

            if (response.ok && result.success && result.data) {
              // Return user object that will be passed to JWT
              const user= result.data.user;
              console.log(user);
              return {
                id: user.id,
                name:user.name,
                email: user.email,
                role: user.role, // Since this is admin-only app
                token: result.data.access_token,
                username: user.name,
              };
            }
          } catch (error) {
            console.error("Login error:", error);
          }
        }

        return null;
      },
    }),
  ],
} as NextAuthConfig;
