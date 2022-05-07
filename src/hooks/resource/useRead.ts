import * as React from 'react'
import { useQuery, useQueryClient } from 'react-query'

import { Resource } from '../../Services/ResourceService'

import { UseCRUD } from './resourceHookTypes'

function useRead<T extends Resource>({ service, id }: UseCRUD<T>) {
  const queryClient = useQueryClient()

  const { data, isLoading: isReading } = useQuery(
    service.getQueryKey([id]),
    () => {
      if (id) {
        return service.fetch({ id })
      }

      throw new Error('id is required')
    },
    {
      enabled: !!id
    }
  )

  const prefetch = React.useCallback(
    ({ id: innerId }: { id: T['id'] }) =>
      queryClient.prefetchQuery(service.getQueryKey([id]), () =>
        service.fetch({ id: innerId })
      ),
    []
  )

  return {
    data,
    prefetch,
    isReading
  }
}

export default useRead
