"use server";

import { auth } from "@/auth";
import { CreateSubscriptionRequest, SingleSubscriptionResponse } from "@/types/subscription.type";
import { createSubscriptionSchema } from "@/schema/subscription-schema";
import { revalidatePath } from "next/cache";

export const createSubscription = async (
  data: CreateSubscriptionRequest
): Promise<SingleSubscriptionResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // Validate the input data
    const validatedData = createSubscriptionSchema.parse(data);

    console.log("Creating subscription with data:", validatedData);

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/plans`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to create subscription");
    }

    // Revalidate the subscriptions cache
    revalidatePath("/dashboard/payments/subscriptions");

    return {
      success: true,
      data: result.data,
      message: result.message || "Subscription created successfully",
    };
  } catch (error) {
    console.error("Error creating subscription:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};
