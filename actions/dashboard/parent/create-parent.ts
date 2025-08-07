"use server";

import { auth } from "@/auth";

export interface CreateParentData {
  email: string;
  password: string;
  username: string;
}

export interface CreateParentResponse {
  success: boolean;
  message: string;
  data?: {
    sucess:boolean;
    message:string;
  };
}

export const createParent = async (data: CreateParentData): Promise<CreateParentResponse> => {
  try {
    const session = await auth();
    
    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/auth/parent/register`,
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
      throw new Error(result.message || "Failed to create parent account");
    }

    return {
      success: true,
      message: result.message || "Parent account created successfully",
    };
  } catch (error) {
    console.error("Error creating parent:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create parent account",
    };
  }
};
