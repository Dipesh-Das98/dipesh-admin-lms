"use server";

import { auth } from "@/auth";

interface UpdateAds {
  title?: string;
  description?: string;
  link?: string;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  imageUrl?: string;
  id: string;
}
export async function updateAds(data: UpdateAds){
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }
    const updatedData: Record<string, string | boolean> = {};
    if (data.title) updatedData.title = data.title;
    if (data.description) updatedData.description = data.description;
    if (data.link) updatedData.link = data.link;
    if (data.startDate) updatedData.startDate = data.startDate.toISOString();
    if (data.endDate) updatedData.endDate = data.endDate.toISOString();
    if (data.isActive !== undefined) updatedData.isActive = data.isActive;
    if (data.imageUrl) updatedData.imageUrl = data.imageUrl;
    console.log("Updated Data:", updatedData);
    // Call your API to create a new ad
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/ads/${data.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.backendToken}`,
        },
        body: JSON.stringify(updatedData),
      }
    );
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
    };
  } catch (error) {
    console.error("Error creating advertisement:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create advertisement",
    };
  }
}
