import { isUndefined } from 'lodash'
import * as React from 'react'
import { useQueryClient, useMutation, UseMutationOptions } from 'react-query'

import { useProvider } from '../Provider'

export type UseMutateStorageOptions<TData = any> = UseMutationOptions<
  void,
  unknown,
  TData | undefined,
  void
>

function useStorageMutation<TData = any>(
  key: string,
  options: UseMutateStorageOptions<TData> = {}
) {
  const storage = useProvider((provider) => provider.storage)
  const queryClient = useQueryClient()

  const setItem = React.useCallback(
    (variables: TData | undefined) => {
      return new Promise<void>(async (resolve, reject) => {
        try {
          if (!isUndefined(variables)) {
            await storage.setItemAsync(key, JSON.stringify(variables))
          } else {
            /**
             * TODO: decide if this good
             *
             * alternative: let the item be set to undefined
             */
            await storage.deleteItemAsync(key)
          }

          resolve()
        } catch (err) {
          reject(err)
        }
      })
    },
    [key]
  )

  const mutation = useMutation(setItem, {
    ...options,
    onMutate: (variables) => {
      queryClient.setQueryData(key, variables)
      options.onMutate?.(variables)
    }
  })

  return mutation
}

export default useStorageMutation
