"use client";
import { truncate } from "@/lib/utils";
import NavUserSettings from "./nav-user-settings";
import { Skeleton } from "../ui/skeleton";
import { useSessionSync } from "@/hooks/use-session-sync";

const UserProfile = () => {
  const { session, status } = useSessionSync();

  // Transform the session user to match the expected type
  const user = session?.user
    ? {
        name: session.user.name || "",
        email: session.user.email || "",
        role: session.user.role || "",
      }
    : null;

  console.log("UserProfile session:", status);

  return (
    <div className="flex items-center space-x-2">
      {/* user name */}
      <div className="text-sm font-semibold sr-only  text-neutral-900 dark:text-neutral-100">
        {truncate(user?.name || "", 18)}
      </div>
      {status === "loading"  ? (
        <Skeleton className="h-12 w-12 rounded-full" />
      ) : (
        <NavUserSettings user={user} />
      )}
    </div>
  );
};

export default UserProfile;
