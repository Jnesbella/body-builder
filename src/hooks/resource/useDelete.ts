import { useMutation, useQueryClient } from 'react-query'

import { Resource } from '../../Services/ResourceService'

import { UseCRUD } from './resourceHookTypes'

function useDelete<T extends Resource>({ service }: UseCRUD<T>) {
  const queryClient = useQueryClient()

  const { mutateAsync: deleteOne, isLoading: isDeleting } = useMutation(
    (payload: T) => service.deleteOne(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(service.getQueryKey())
      }
    }
  )

  return {
    deleteOne,
    isDeleting
  }
}

export default useDelete
