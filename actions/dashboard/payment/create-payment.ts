"use server";

import { auth } from "@/auth";

import { CreatePaymentSchema, createPaymentSchema } from "@/schema";
import { Payment, PaymentResponse } from "@/types/payments.type";

export const createPayment = async (
  data: CreatePaymentSchema
): Promise<PaymentResponse<Payment>> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // Validate the input data
    const parsedData = createPaymentSchema.safeParse(data);
    if (!parsedData.success) {
      const errorMessages = parsedData.error.errors.map(
        (error) => error.message
      );
      throw new Error(`Validation failed: ${errorMessages.join(", ")}`);
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/payment/manual-payment`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData.data),
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to create Payment");
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Payment created successfully",
    };
  } catch (error) {
    console.error("Error creating Payment:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};
