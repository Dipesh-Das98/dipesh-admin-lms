"use server";

import { auth } from "@/auth";

export interface createAdminData {
  email: string;
  password: string;
  name: string;
}

export interface CreateAdminResponse {
  success: boolean;
  message: string;
  data?: {
    sucess: boolean;
    message: string;
  };
}

export const createAdmin = async (data: createAdminData): Promise<CreateAdminResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken || !session?.user) {
      throw new Error("Authentication required");
    }

    if (session?.user?.role !== "SUPER_ADMIN") {
      throw new Error("You do not have permission to create an admin account");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/auth/admin/register`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );


    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to create admin account");
    }

    return {
      success: true,
      message: result.message || "Admin account created successfully",
    };
  } catch (error) {
    console.error("Error creating admin:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create admin account",
    };
  }
};
