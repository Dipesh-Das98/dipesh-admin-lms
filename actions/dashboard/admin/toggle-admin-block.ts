"use server";

import { auth } from "@/auth";

export interface ToggleAdminBlockData {
  id: string;
  blocked: boolean;
}

export interface ToggleAdminBlockResponse {
  success: boolean;
  message: string;
  data?: {
    success: boolean;
    message: string;
  };
}

export const toggleAdminBlock = async (data: ToggleAdminBlockData): Promise<ToggleAdminBlockResponse> => {
  try {
    const session = await auth();
    
    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const { id, blocked } = data;

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/auth/admin/toggle-block/${id}`,
      {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || `Failed to ${blocked ? 'block' : 'unblock'} admin account`);
    }

    return {
      success: true,
      message: `Admin successfully ${blocked ? 'blocked' : 'unblocked'}`,
      data: result.data
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : `Failed to ${data.blocked ? 'block' : 'unblock'} admin account`;
    
    return {
      success: false,
      message: errorMessage,
    };
  }
};
