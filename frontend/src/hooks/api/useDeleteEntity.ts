import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import type { DeleteParam } from '@/types';
import type { DeleteService } from '@/types/ServiceCalls';

export interface UseDeleteEntityHookParam<PK extends string> {
  queryKey: string ;
  deleteFn: DeleteService<PK>;
}
export type UseDeleteEntityHookResponse<PK extends string> =
  UseMutationResult<void, Error, DeleteParam<PK>>;

export function useDeleteEntity<PK extends string>(
  { queryKey, deleteFn }: UseDeleteEntityHookParam<PK>
): UseDeleteEntityHookResponse<PK> {
  const qc = useQueryClient();
  return useMutation<void, Error, DeleteParam<PK>>({
          mutationFn: deleteFn,
          onSuccess: () => {
              qc.invalidateQueries({ queryKey: [queryKey] });
          }
      });
}