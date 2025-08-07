import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getCourseById, GetCourseResponse } from "@/actions/dashboard/course/get-course";

export const useCourse = (
  id: string,
  options?: Omit<UseQueryOptions<GetCourseResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourseById(id),
    enabled: !!id,
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

export default useCourse;