"use server";

import { auth } from "@/auth";

export async function createAd(data: {
  title: string;
  description: string;
  link: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}) {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }
    // Call your API to create a new ad
    const response = await fetch(`${process.env.BACKEND_API_URL}/ads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.backendToken}`,
      },
      body: JSON.stringify({
        ...data,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating advertisement:", errorData);
      return {
        success: false,
        message: `Failed to create advertisement: ${response.statusText}`,
      };
    }

    return {
        success: true,
        message: "Advertisement created successfully",
    }
  } catch (error) {
    console.error("Error creating advertisement:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create advertisement",
    };
  }
}
