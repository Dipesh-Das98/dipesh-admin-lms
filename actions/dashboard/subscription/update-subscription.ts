"use server";

import { auth } from "@/auth";
import { UpdateSubscriptionRequest, SingleSubscriptionResponse } from "@/types/subscription.type";
import { updateSubscriptionSchema } from "@/schema/subscription-schema";
import { revalidatePath } from "next/cache";

export const updateSubscription = async (
  data: UpdateSubscriptionRequest
): Promise<SingleSubscriptionResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // Validate the input data
    const validatedData = updateSubscriptionSchema.parse(data);
    const { id, ...updateData } = validatedData;

    console.log("Updating subscription with ID:", id, "Data:", updateData);

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/plans/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to update subscription");
    }

    // Revalidate the subscriptions cache
    revalidatePath("/dashboard/payments/subscriptions");
    revalidatePath(`/dashboard/payments/subscriptions/${id}`);

    return {
      success: true,
      data: result.data,
      message: result.message || "Subscription updated successfully",
    };
  } catch (error) {
    console.error("Error updating subscription:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};
