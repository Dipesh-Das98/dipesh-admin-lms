"use client";

import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import useCategory from "@/hooks/use-category";
import CourseForm from "./create-course-form";
import { Category } from "@/types";
const CreateCourseWrapper = () => {
  const {
    data: categories,
    isLoading,
    isError,
    refetch,
  } = useCategory<Category[]>("course");

  if (isLoading) return <LoadingState />;

  if (isError)
    return (
      <ErrorState
        onRetry={refetch}
        message="Failed to load categories. Please try again."
      />
    );

  return <CourseForm categories={categories || []} />;
};

export default CreateCourseWrapper;
