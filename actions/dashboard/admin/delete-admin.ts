"use server";

import { auth } from "@/auth";

export interface deleteAdminData {
  id: string;
}

export interface DeleteAdminResponse {
  success: boolean;
  message: string;
  data?: {
    success: boolean;
    message: string;
  };
}

export const deleteAdmin = async (
  data: deleteAdminData
): Promise<DeleteAdminResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    if (session.user.role !== "SUPER_ADMIN") {
      throw new Error("You are not authorized to delete an admin account");
    }

    if (session.user.id === data.id) {
      throw new Error("You cannot delete your own account");
    }

    const { id } = data;

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/auth/admin/delete-admin/${id}`,
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
      throw new Error(result.message || "Failed to delete admin account");
    }

    return {
      success: true,
      message: result.message || "Account deleted sucessfully",
    };
  } catch (error) {
    console.error("Error deleting admin:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete admin account",
    };
  }
};
