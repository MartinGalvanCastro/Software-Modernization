import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { CreateParam } from '@/types';
import type { CreateService } from '@/types/ServiceCalls';


export interface UseCreateEntityHookParam<T, TInput> {
  queryKey: string;
  createFn: CreateService<TInput, T>;
}

export type UseCreateEntityHookResponse<T, TInput> = UseMutationResult<T, Error, CreateParam<TInput>>;

export function useCreateEntity<T, TInput>(
 {
    queryKey,
    createFn
  }: UseCreateEntityHookParam<T, TInput>

 ): UseMutationResult<T, Error, CreateParam<TInput>> {
  const queryClient = useQueryClient();

  return useMutation<T, Error, CreateParam<TInput>>({
    mutationFn: createFn,
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    }
  });
}
