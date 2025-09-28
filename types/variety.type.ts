export interface CreateVarietyData {
  title: string;
  description: string;
  isActive: boolean;
}

export interface Variety {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVarietyResponse {
  success: boolean;
  message: string;
  data?: Variety;
}

export interface GetAllVarietiesParams {
  page?: number;               // starts from 1
  limit?: number;              // number of items per page
  search?: string;             // optional search query
  sortOrder?: "asc" | "desc";  // optional sorting
  isActive: boolean;           // required
}

export interface GetAllVarietiesResponse {
  success: boolean;
  message: string;
  data: {
    variety: Variety[];
    meta: {
      total: number;
      page: number;
      limit: number;
      hasNext: boolean;
    };
  };
}

export interface GetSingleVarietyResponse {
  success: boolean;
  message: string;
  data?: Variety;
}

export interface UpdateVarietyData {
  id: string;
  thumbnailUrl?: string;
  videoUrl?: string;
}

export interface UpdateVarietyResponse {
  success: boolean;
  message: string;
  data?: Variety;
}

export interface DeleteVarietyResponse {
  success: boolean;
  message: string;
  data?: string; // success message string
}