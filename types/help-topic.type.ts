// src/types/help-topic.type.ts

// For create
export interface CreateHelpTopicData {
  topicName: string;
  questions: string[];
}

export interface HelpTopic {
  id: string;
  topicName: string;
  questions: string[];
  createdAt: string;
  updatedAt: string;
  iconUrl?: string;
}

export interface CreateHelpTopicResponse {
  success: boolean;
  message: string;
  data?: {
    message: string;
    data: HelpTopic;
  };
}

// Already have For Patch

export interface UpdateHelpTopicData {
  topicName: string;
  questions: string[];
  iconUrl?: string;
}

export interface UpdateHelpTopicResponse {
  success: boolean;
  message: string;
  data?: {
    message: string;
    data: HelpTopic;
  };
}

// Delete

export interface DeleteHelpTopicResponse {
  success: boolean;
  message: string;
  data?: {
    message: string;
  };
}

// Get all help topics
export interface GetAllHelpTopicsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: "asc" | "desc";
  isActive?: boolean;
}

export interface GetAllHelpTopicsResponse {
  success: boolean;
  message: string;
  data: {
    helptopics: HelpTopic[];
    meta: {
      total: number;
      page: number;
      limit: number;
      hasNext: boolean;
    };
  };
}

export interface GetSingleHelpTopicResponse {
  success: boolean;
  message: string;
  data?: HelpTopic;
}