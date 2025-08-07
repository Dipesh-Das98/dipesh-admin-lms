import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { GetChpaterResponse } from "@/actions/dashboard/course/chapter/get-chapter";
import { getChapterById } from "@/actions/dashboard/course/chapter/get-chapter";

export const useChapter = (
  id: string,
  options?: Omit<UseQueryOptions<GetChpaterResponse>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: ["chapter", id],
    queryFn: () => getChapterById(id),
    enabled: !!id,
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};
