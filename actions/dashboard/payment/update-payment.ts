"use server";

import { auth } from "@/auth";
import { UpdatePaymentSchema, updatePaymentSchema } from "@/schema";
import { PaymentResponse} from "@/types";

export const updatePayment = async (
  data: UpdatePaymentSchema
): Promise<PaymentResponse<null>> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // Validate the input data
    const validatedData = updatePaymentSchema.safeParse(data);
    if (!validatedData.success) {
      const errorMessages = validatedData.error.errors.map(
        (error) => error.message
      );
      throw new Error(`Validation failed: ${errorMessages.join(", ")}`);
    }
    const { id, ...updateData } = validatedData.data;

    console.log("Updating subscription with ID:", id, "Data:", updateData);

    const response = await fetch(`${process.env.BACKEND_API_URL}/payment/update-manual-payment/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to update Payments");
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Payments updated successfully",
    };
  } catch (error) {
    console.error("Error updating Payments:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};
