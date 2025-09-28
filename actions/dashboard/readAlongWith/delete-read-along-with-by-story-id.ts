"use server";
import { auth } from "@/auth";

export async function deleteReadAlongStory(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.backendToken) {
      return { success: false, message: "Unauthorized: No access token." };
    }

    const res = await fetch(
      `${process.env.BACKEND_API_URL}/readAlongStories/delete-read-along-story/${id}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${session?.user?.backendToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const errorResponse = await res.json();
      return {
        success: false,
        message: errorResponse.message || "Failed to delete story.",
      };
    }

    return { success: true, message: "Story deleted successfully." };
  } catch (error) {
    console.error("Error deleting story:", error);
    return { success: false, message: "Unexpected error. Try again." };
  }
}
