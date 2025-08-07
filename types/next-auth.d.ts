import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      username: string;
      email:string;
      backendToken: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    username: string;
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string;
    username: string;
    backendToken: string;
  }
}
