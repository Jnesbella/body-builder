import * as React from 'react'
import { useMutation, useQueryClient } from 'react-query'

import { Resource } from '../../Services/ResourceService'

import { UseCRUD } from './resourceHookTypes'

function useUpdate<T extends Resource, K extends Resource = T>({
  service
}: UseCRUD<T>) {
  const queryClient = useQueryClient()

  const doUpdate = React.useCallback(
    (payload: Partial<K> & { id: T['id'] }) => service.update<K>(payload),
    []
  )

  const { mutateAsync: update, isLoading: isUpdating } = useMutation(doUpdate, {
    onSuccess: (nextData) => {
      queryClient.invalidateQueries(service.getQueryKey())

      queryClient.invalidateQueries(service.getQueryKey([nextData.id]))
      // queryClient.setQueryData(service.getQueryKey([nextData.id]), nextData);
    }
  })

  return {
    update,
    isUpdating
  }
}

export default useUpdate
