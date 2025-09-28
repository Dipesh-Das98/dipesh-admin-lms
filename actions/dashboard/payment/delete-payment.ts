"use server";

import { auth } from "@/auth";

export interface DeletePaymentResponse {
  success: boolean;
  message: string;
}

export const deletePayment= async (
  id: string
): Promise<DeletePaymentResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (!id) {
      throw new Error("Payment ID is required");
    }

    console.log("Deleting Payment with ID:", id);

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/payment/${id}`,
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
      throw new Error(result.message || "Failed to delete Payment");
    }

    return {
      success: true,
      message: result.message || "Payment deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting Payment:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};
