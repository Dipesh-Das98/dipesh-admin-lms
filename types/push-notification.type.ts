export interface CreatePushNotificationTemplateData {
  title: string;
  message: string;
  startTime: string;
  endTime: string;
}

export interface PushNotificationTemplate {
  id: string;
  title: string;
  message: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePushNotificationTemplateResponse {
  success: boolean;
  message: string;
  data?: {
    message: string;
    data: PushNotificationTemplate;
  };
}

export interface UpdatePushNotificationTemplateData {
  title: string;
  message: string;
  startTime: string;
  endTime: string;
}
export interface UpdatePushNotificationTemplateResponse {
  success: boolean;
  message: string;
  data?: {
    message: string;
    data: PushNotificationTemplate;
  };
}

export interface DeletePushNotificationTemplateResponse {
  success: boolean;
  message: string;
  data?: {
    message: string;
  };
}

export interface GetPushNotificationTemplateResponse {
  success: boolean;
  message: string;
  data?: PushNotificationTemplate;
}

export interface GetAllPushNotificationTemplatesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: "asc" | "desc";
  // Add any other filter parameters the API accepts (e.g., isActive, type)
}
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

export interface GetAllPushNotificationTemplatesResponse {
  success: boolean;
  message: string;
  data?: {
    pushNotificationTemplates: PushNotificationTemplate[];
    meta: PaginationMeta;
  };
}