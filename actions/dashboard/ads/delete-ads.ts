"use server";

import { auth } from "@/auth";

export async function deleteAd(id: string) {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }
    // Call your API to create a new ad
    const response = await fetch(`${process.env.BACKEND_API_URL}/ads/${id}`, {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.backendToken}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating advertisement:", errorData);
      return {
        success: false,
        message: `Failed to delete advertisement: ${response.statusText}`,
      };
    }

    return {
      success: true,
      message: "Advertisement deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting advertisement:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to deleting advertisement",
    };
  }
}
