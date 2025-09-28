export type Admin = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "SUPER_ADMIN";
  isBlocked: boolean;
  createdAt: string;
};

export type AdminApiResponse = {
  success: boolean;
  data: {
    admins: Admin[];
    meta: {
      total: number;
      page: number;
      limit: number;
      hasNext: boolean;
    };
  };
  message: string;
};

export type AdminCreateRequest = {
  email: string;
  name: string;
  password: string;
};

export type AdminUpdateRequest = {
  email?: string;
  name?: string;
};

export type AdminFilters = {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  search?: string;
};
