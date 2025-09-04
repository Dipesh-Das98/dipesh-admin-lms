"use server";

import { auth } from "@/auth";
import { DeleteHelpTopicResponse } from "@/types/help-topic.type";

export const deleteHelpTopic = async (
  id: string
): Promise<DeleteHelpTopicResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/help-topic/delete-help-topic/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete help topic");
    }

    return {
      success: true,
      message: result.message || "Help Topic deleted successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Delete Help Topic error:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};
