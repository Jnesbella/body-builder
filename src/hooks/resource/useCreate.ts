import * as React from 'react'
import { useMutation, useQueryClient } from 'react-query'

import { Resource } from '../../Services/ResourceService'

import { UseCRUD } from './resourceHookTypes'

function useCreate<T extends Resource, K extends Resource = T>({
  service
}: UseCRUD<T>) {
  const queryClient = useQueryClient()

  const doCreate = React.useCallback(
    (payload: Partial<K>) => service.create(payload),
    []
  )

  const { mutateAsync: create, isLoading: isCreating } = useMutation(doCreate, {
    onSuccess: () => {
      queryClient.invalidateQueries(service.getQueryKey())
    }
  })

  return {
    create,
    isCreating
  }
}

export default useCreate
