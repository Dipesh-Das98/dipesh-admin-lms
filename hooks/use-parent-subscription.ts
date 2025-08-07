import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getChildSubscriptionByParentId } from "@/actions/dashboard/payment/get-children-without-subscription";
import { ChildSubscriptionResponse } from "@/types";

export const useParentSubscription = (
  id: string,
  options?: Omit<
    UseQueryOptions<ChildSubscriptionResponse>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: ["payment","parent", id],
    queryFn: () => getChildSubscriptionByParentId(id),
    enabled: !!id,
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

export default useParentSubscription;
