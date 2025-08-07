export type Parent = {
  id: string;
  email: string;
  username: string;
  role: "PARENT";
  phone?: string; // Optional field, can be undefined
  createdAt: string;

};

export type ParentApiResponse = {
  success: boolean;
  data: {
    parents: Parent[];
    meta: {
      total: number;
      page: number;
      limit: number;
      hasNext: boolean;
    };
  };
  message: string;
};

export type ParentCreateRequest = {
  email: string;
  username: string;
  password: string;
};

export type ParentUpdateRequest = {
  email?: string;
  username?: string;
};

export type ParentFilters = {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  search?: string;
};
