/** Defines the pagination metadata returned by the API (re-used from previous action) */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

/**
 * Interface for the payload to create a new Pop-up Notification Template.
 * Note the addition of 'button2RedirectUrl'.
 */
export interface CreatePopupNotificationTemplateData {
  imageUrl: string;
  title: string;
  message: string;
  button1Label: string;
  button2Label: string;
  button2RedirectUrl: string; // New field identified from cURL
  targetAudience: "ALL_USERS" | "PARENTS_ONLY"; // Example values
  startTime: string;
  endTime: string;
}

/**
 * Interface for a single Pop-up Notification Template entity (updated to include new field).
 */
export interface PopupNotificationTemplate {
  id: string;
  imageUrl: string;
  title: string;
  message: string;
  button1Label: string;
  button2Label: string;
  button2RedirectUrl: string; // Included in response data
  targetAudience: "ALL_USERS" | "PARENTS_ONLY";
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePopupNotificationTemplateResponse {
  success: boolean;
  message: string;
  data?: {
    message: string;
    data: PopupNotificationTemplate;
  };
}

export interface UpdatePopupNotificationTemplateData {
  imageUrl?: string; // Made optional here for cleaner interface, but will be enforced by Partial<T> in the function
  title?: string;
  message?: string;
  button1Label?: string;
  button2Label?: string;
  button2RedirectUrl?: string;
  targetAudience?: "ALL_USERS" | "PARENTS_ONLY";
  startTime?: string;
  endTime?: string;
}


export interface UpdatePopupNotificationTemplateResponse {
  success: boolean;
  message: string;
  data?: {
    message: string;
    data: PopupNotificationTemplate;
  };
}

export interface DeletePopupNotificationTemplateResponse {
  success: boolean;
  message: string;
  data?: {
    message: string;
  };
}

export interface GetAllPopupNotificationTemplatesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Standard API response structure for fetching a list of pop-up templates with pagination.
 */
export interface GetAllPopupNotificationTemplatesResponse {
  success: boolean;
  message: string;
  data?: {
    popupNotificationTemplates: PopupNotificationTemplate[];
    meta: PaginationMeta;
  };
}

export interface GetPopupNotificationTemplateResponse {
  success: boolean;
  message: string;
  data?: PopupNotificationTemplate;
}