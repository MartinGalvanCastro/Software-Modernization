import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { UpdateParam } from '@/types';
import type { UpdateService } from '@/types/ServiceCalls';

export interface UseUpdateEntityHookParam<PK extends string, T, TInput> {
  queryKey: string;
  updateFn: UpdateService<PK, TInput, T>;
}


export type UseUpdateEntityHookResponse<PK extends string, T, TInput> =
  UseMutationResult<T, Error, UpdateParam<PK, TInput>>;

  export function useUpdateEntity<PK extends string, T, TInput>(
  { queryKey, updateFn }: UseUpdateEntityHookParam<PK, T, TInput>
): UseUpdateEntityHookResponse<PK, T, TInput> {
  const qc = useQueryClient();
  return useMutation<T, Error, UpdateParam<PK, TInput>>(
    {
      mutationFn: updateFn,
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [queryKey] });
      }
    }
  );
}