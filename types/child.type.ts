import {
  Gender,
  Language,
  PARENT_ROLE,
} from "@/config/forms/child-form-options";

export interface child {
  id: string;
  nickname: string;
  avatar: string;
  gender: Gender;
  language: Language;
  password?: string;
  grade: string;
  parentId: string;
  parentRole?: PARENT_ROLE;
  createdAt?: string;
  updatedAt?: string;
}

export type ChildApiResponse = {
  success: boolean;
  data: {
    children: child[];
    meta: {
      total: number;
      page: number;
      limit: number;
      hasNext: boolean;
    };
  };
  message: string;
};

export type ChildFilters = {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  search?: string;
};
