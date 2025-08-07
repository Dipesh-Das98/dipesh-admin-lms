"use server";

import { auth } from "@/auth";
import { cache } from "react";

export const currentUserProfile = cache(async () => {
  try {
    const session = await auth();
    console.log("SESSION", session);

    if (!session?.user || !session?.user?.backendToken) {
      return null;
    }

    console.log("SESSION", session.expires);

    // Call backend API to get current user
    const response = await fetch(`${process.env.BACKEND_API_URL}/auth/admin/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.user.backendToken}`,
      },
    });

    if (!response.ok) {
      console.log("[SERVER] CURRENT USER API ERROR", response.status, response.statusText);
      return null;
    }

    const result = await response.json();

    if (result.success && result.data) {
      return {
        id: result.data.id,
        name: result.data.name,
        email: result.data.email,
        role: result.data.role,
        createdAt: result.data.createdAt,
        updatedAt: result.data.updatedAt,
      };
    }

    return null;
  } catch (error) {
    console.log("[SERVER] CURRENT USER ERROR", error);
    return null;
  }
});
