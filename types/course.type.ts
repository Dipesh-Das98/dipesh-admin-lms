// Course Type based on the response structure provided
export interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  isPublished: boolean;
  categoryId: string | null;
  language: string;
  grade: string;
  backgroundColor: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  } | null;
  chapters?: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  position: number;
  isPublished: boolean;
  courseId: string;
  assignments?: Assignment | null;
  createdAt: Date | string;
  updatedAt: Date | string;

}

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  isPublished: boolean;
  type: "QUIZ";
  questions: AssignmentQuiz[];
}
export interface AssignmentQuiz {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}


// API Response Types
export interface CourseApiResponse {
  success: boolean;
  data: {
    courses: Course[];
    meta: {
      total: number;
      page: number;
      limit: number;
      hasNext: boolean;
    };
  };
  message: string;
}

// Single Course Response
export interface SingleCourseApiResponse {
  success: boolean;
  data: Course;
  message: string;
}
