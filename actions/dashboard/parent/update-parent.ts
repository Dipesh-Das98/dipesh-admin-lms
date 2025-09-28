"use server";

import { auth } from "@/auth";

export interface UpdateParentData {
  id: string;
  email?: string;
  username?: string;
  phone?: string; // Optional field, can be undefined
  password?: string; // Optional field, can be undefined
}

export interface UpdateParentResponse {
  success: boolean;
  message: string;
  data?: {
    success: boolean;
    message: string;
  };
}

export const updateParent = async (data: UpdateParentData): Promise<UpdateParentResponse> => {
  try {
    const session = await auth();
    
    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const { id, ...updateData } = data;
    // if no password is provided, we should not include it in the updateData
    if (!updateData.password) {
      delete updateData.password;
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/auth/parent/update-parent/${id}`,
      {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );


    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to update parent account");
    }

    return {
      success: true,
      message: result.message || "Parent account updated successfully",
    };
  } catch (error) {
    console.error("Error updating parent:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update parent account",
    };
  }
};
