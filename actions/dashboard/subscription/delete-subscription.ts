"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export interface DeleteSubscriptionResponse {
  success: boolean;
  message: string;
}

export const deleteSubscription = async (
  id: string
): Promise<DeleteSubscriptionResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (!id) {
      throw new Error("Subscription ID is required");
    }

    console.log("Deleting subscription with ID:", id);

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/plans/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete subscription");
    }

    // Revalidate the subscriptions cache
    revalidatePath("/dashboard/payments/subscriptions");

    return {
      success: true,
      message: result.message || "Subscription deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};
