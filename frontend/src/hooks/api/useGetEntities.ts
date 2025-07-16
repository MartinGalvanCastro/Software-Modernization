import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { GetService } from '@/types/ServiceCalls';

export interface UseGetEntitiesHookParam<T> {
  queryKey: string;
  getFn: GetService<T>;
}

export type UseGetEntitiesHookResponse<T> = UseQueryResult<T>;

export function useGetEntities<T>({ queryKey, getFn }: UseGetEntitiesHookParam<T>): UseGetEntitiesHookResponse<T> {
  return useQuery<T>({
    queryKey: [queryKey],
    queryFn: getFn,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}