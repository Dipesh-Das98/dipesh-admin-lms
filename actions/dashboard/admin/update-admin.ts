"use server";

import { auth } from "@/auth";

export interface UpdateAdminData {
  id: string;
  email?: string;
  name?: string;
}

export interface UpdateAdminResponse {
  success: boolean;
  message: string;
  data?: {
    success: boolean;
    message: string;
  };
}

export const updateAdmin = async (data: UpdateAdminData): Promise<UpdateAdminResponse> => {
  try {
    const session = await auth();
    
    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const { id, ...updateData } = data;

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/auth/admin/update-admin/${id}`,
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
      throw new Error(result.message || "Failed to update admin account");
    }

    return {
      success: true,
      message: result.message || "Admin account updated successfully",
    };
  } catch (error) {
    console.error("Error updating admin:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update admin account",
    };
  }
};
