import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getLibraryById } from "@/actions/dashboard/library/get-library-by-id";
import { Library } from "@/types";

interface GetLibraryByIdResponse {
  success: boolean;
  data?: Library;
  message?: string;
}

export const useLibrary = (
  id: string,
  options?: Omit<UseQueryOptions<GetLibraryByIdResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ["library", id],
    queryFn: () => getLibraryById(id),
    enabled: !!id,
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

export default useLibrary;
