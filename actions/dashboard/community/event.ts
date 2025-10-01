"use server";

import { auth } from "@/auth";
import { cache } from "react";

export type TargetType = "ALL" | "PARENT";

export interface Event {
  id: string;
  eventName: string;
  eventDateTime: string;
  targetType: TargetType;
  parentId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetEventsMeta {
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

export interface GetEventsResponse {
  success: boolean;
  message: string;
  data: {
    events: Event[];
    meta: GetEventsMeta;
  };
}

export interface CreateEventData {
  eventName: string;
  eventDateTime: string;
  targetType: TargetType;
  parentId: string;
}

export interface CreateEventResponse {
  success: boolean;
  message: string;
  data?: Event;
}

export interface UpdateEventData {
  id: string;
  eventName?: string;
  eventDateTime?: string;
  targetType?: TargetType;
  parentId?: string;
  isActive?: boolean;
}

export interface UpdateEventResponse {
  success: boolean;
  message: string;
  data?: Event;
}

export const createEvent = async (
  data: CreateEventData
): Promise<CreateEventResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/community/create-event`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to create event");
    }

    return {
      success: true,
      message: result.message || "Event created successfully",
      data: result.data?.data,
    };
  } catch (error) {
    console.error("Error creating event:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create event",
    };
  }
};

export const updateEvent = async (
  data: UpdateEventData
): Promise<UpdateEventResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    // Prepare update payload (only include fields that are defined)
    const updatePayload: Partial<UpdateEventData> = {};

    if (data.eventName !== undefined) updatePayload.eventName = data.eventName;
    if (data.eventDateTime !== undefined)
      updatePayload.eventDateTime = data.eventDateTime;
    if (data.targetType !== undefined)
      updatePayload.targetType = data.targetType;
    if (data.parentId !== undefined) updatePayload.parentId = data.parentId;
    if (data.isActive !== undefined) updatePayload.isActive = data.isActive;

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/community/update-event/${data.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to update event");
    }

    return {
      success: true,
      message: result.message || "Event updated successfully",
      data: result.data?.data,
    };
  } catch (error) {
    console.error("Error updating event:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update event",
    };
  }
};

export const deleteEvent = cache(async (id: string) => {
  try {
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/community/delete-event/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete event");
    }

    return {
      success: true,
      message: result.message || "Event deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting event:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete event",
    };
  }
});

export const getEvents = cache(
  async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ): Promise<GetEventsResponse> => {
    try {
      const session = await auth();

      if (!session?.user?.backendToken) {
        throw new Error("Authentication required");
      }

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortOrder: sortOrder || "desc",
      });

      // Add sort field if provided
      if (sortBy) {
        params.append("sortBy", sortBy);
      }

      // Add search parameter if provided
      if (search && search.trim()) {
        params.append("search", search.trim());
      }

      const response = await fetch(
        `${
          process.env.BACKEND_API_URL
        }/community/get-all-events?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.backendToken}`,
          },
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to get events");
      }

      return {
        success: true,
        message: result.message || "Events fetched successfully",
        data: {
          events: result.data?.events || [],
          meta: result.data?.meta || {
            total: 0,
            page: 1,
            limit: 10,
            hasNext: false,
          },
        },
      };
    } catch (error) {
      console.error("Error getting events:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to get events",
        data: {
          events: [],
          meta: {
            total: 0,
            page: 1,
            limit: 10,
            hasNext: false,
          },
        },
      };
    }
  }
);
