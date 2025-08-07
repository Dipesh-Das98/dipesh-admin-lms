export interface CreateReadAlongStoryData {
  title: string;
  author: string;
  illustratedBy: string;
  publishedBy: string;
  isActive: boolean;
  overAllScore: number;
}

export interface CreateReadAlongStoryResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    title: string;
    author: string;
    illustratedBy: string;
    publishedBy: string;
    isActive: boolean;
    thumbnailUrl: string;
    overAllScore: number;
    createdAt: string;
    updatedAt: string;
    // Include other fields if response contains more
  };
}

export interface ReadAlongSlideInput {
  readWithUsId: string;
  content: string;
  imageUrl: string;
  orderNo: number;
}

export interface CreateReadAlongSlidesData {
  slideList: ReadAlongSlideInput[];
}

export interface ReadAlongSlide {
  id: string;
  readWithUsId: string;
  content: string;
  imageUrl: string;
  orderNo: number;
}


export interface CreateReadAlongSlidesResponse {
  success: boolean;
  message: string;
  data?: ReadAlongSlide[]; // Adjust this if the response data is different
}

export interface ReadAlongStory {
  id: string;
  title: string;
  author: string;
  illustratedBy: string;
  publishedBy: string;
  isActive: boolean;
  overAllScore: number;
  thumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string;
}


export interface GetReadAlongStoryResponse {
  success: boolean;
  message: string;
  data?: ReadAlongStory;
}

export interface GetAllReadAlongStoriesParams {
  page?: number;         // starts from 1
  limit?: number;        // items per page
  search?: string;       // optional search query
  sortOrder?: "asc" | "desc"; // optional sort order
  isActive: boolean;     // required
}

export interface GetAllReadAlongStoriesResponse {
  success: boolean;
  message: string;
  data: {
    readAlongStories: ReadAlongStory[];
    total: number;
    page: number;
    limit: number;
    meta?: {
      total: number;
      page: number;
      limit: number;
      hasNext: boolean;
    };
  };
}

export interface UpdateReadAlongStoryResponse {
  success: boolean;
  message: string;
  data?: ReadAlongStory;
}


export type GetSingleReadAlongSlideResponse = {
  success: boolean;
  message: string;
  data?: ReadAlongSlide;
};

export type GetReadAlongSlidesResponse = {
  success: boolean;
  message: string;
  data: ReadAlongSlide[];
};

export type UpdateReadAlongSlideData = {
  readWithUsId: string;
  content: string;
  imageUrl: string;
  orderNo: number;
};

export type UpdateReadAlongSlideResponse = GetSingleReadAlongSlideResponse;

export type DeleteReadAlongSlideResponse = {
  success: boolean;
  message: string;
  data?: string; // e.g. "Slide is deleted successful"
};
