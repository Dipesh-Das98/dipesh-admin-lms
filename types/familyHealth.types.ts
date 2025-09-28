export interface CreateFamilyHealthCourseData {
  title: string;
  description: string;
  isActive: boolean;
}

export interface FamilyHealthCourse {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFamilyHealthCourseResponse {
  success: boolean;
  message: string;
  data?: FamilyHealthCourse;
}

export interface GetAllFamilyHealthCoursesParams {
  page?: number;               // starts from 1
  limit?: number;              // number of items per page
  search?: string;             // optional search query
  sortOrder?: "asc" | "desc";  // optional sorting
  isActive: boolean;           // required
}

export interface GetAllFamilyHealthCoursesResponse {
  success: boolean;
  message: string;
  data: {
    familyHealthCourse: FamilyHealthCourse[];
    meta: {
      total: number;
      page: number;
      limit: number;
      hasNext: boolean;
    };
  };
}

export interface GetSingleFamilyHealthCourseResponse {
  success: boolean;
  message: string;
  data?: FamilyHealthCourse;
}

export interface UpdateFamilyHealthCourseData {
  id: string;
  thumbnailUrl?: string;
  videoUrl?: string;
}

export interface UpdateFamilyHealthCourseResponse {
  success: boolean;
  message: string;
  data?: FamilyHealthCourse;
}

export interface DeleteFamilyHealthCourseResponse {
  success: boolean;
  message: string;
  data?: string; // success message string
}
