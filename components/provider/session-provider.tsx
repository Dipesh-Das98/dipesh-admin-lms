import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

interface NextAuthSessionProviderProps {
  children: React.ReactNode;
}

export default async function NextAuthSessionProvider({
  children,
}: NextAuthSessionProviderProps) {
  const session = await auth();

  return (
    <SessionProvider
      session={session}
      refetchInterval={5 * 60}
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
}
