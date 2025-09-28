import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getGameById, GetGameByIdResponse } from "@/actions/dashboard/game/get-game-by-id";

export const useGame = (
  id: string,
  options?: Omit<UseQueryOptions<GetGameByIdResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ["game", id],
    queryFn: () => getGameById(id),
    enabled: !!id,
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

export default useGame;
