import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as string;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.username = token.username as string;
        session.user.backendToken = token.backendToken as string;
      }

      return session;
    },

    async jwt({ token, user }) {
      if (!token.sub) return token;

      if (user) {
        // User is available during sign-in
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.username = user.username;
        token.backendToken = user.token;
      }

      return token;
    },
  },

  session: {
    strategy: "jwt",
  },

  ...authConfig,
});
