import * as React from 'react'
import { isString } from 'lodash'
import { QueryKey, useQuery, UseQueryOptions } from 'react-query'

import { useProvider } from '../Provider'

export type UseQueryStorageOtpions<TData = any> = UseQueryOptions<
  TData,
  unknown,
  TData,
  QueryKey
>

const STORAGE_KEY_ROOT = 'storage-'

function useStorageQuery<TData = any>(
  key: string,
  options: UseQueryStorageOtpions<TData> = {}
) {
  const storage = useProvider((provider) => provider.storage)

  const loadItem = React.useCallback(async (): Promise<TData | undefined> => {
    let item: TData | undefined

    try {
      await storage.deleteItemAsync(key)
      const maybeItem = await storage.getItemAsync(key)
      if (isString(maybeItem)) {
        item = JSON.parse(maybeItem)
      }
    } finally {
      return item
    }
  }, [storage, key])

  const query = useQuery([STORAGE_KEY_ROOT, key], loadItem, {
    ...options
  })

  return query
}

export default useStorageQuery
