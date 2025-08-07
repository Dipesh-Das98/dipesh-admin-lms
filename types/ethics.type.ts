import { Category } from "@/types";import { Language } from "@/config/forms/child-form-options";

export interface Ethics {
  id: string;
  title: string;
  categoryId: string;
  grade: string;
  language: Language;
  description: string;
  thumbnail: string;
  mediaUrl: string;
  backgroundColor: string;
  category:Category

  isActive?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateEthicsData = Omit<Ethics, "id" | "createdAt" | "updatedAt">;
export type UpdateEthicsData = Partial<CreateEthicsData> & { id: string };

export type EthicsApiResponse = {
  success: boolean;
  data: {
    ethics: Ethics[];
    meta: {
      total: number;
      page: number;
      limit: number;
      hasNext: boolean;
    };
  };
  message: string;
};

export type EthicsFilters = {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  search?: string;
  grade?: string;
  language?: Language;
};

// Ethics category interface for dropdown
export interface EthicsCategory {
  id: string;
  name: string;
  description?: string;
}
