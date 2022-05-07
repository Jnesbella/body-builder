import { isUndefined } from 'lodash'
import React from 'react'
import { UseMutateFunction } from 'react-query'

import useStorageMutation from './useStorageMutation'
import useStorageQuery from './useStorageQuery'

export type SetValue<TData = any> = UseMutateFunction<
  void,
  unknown,
  TData | undefined,
  void
>

function useStorageStage<TData = any>(key: string, defaultValue?: TData) {
  const { data: value } = useStorageQuery<TData>(key, { suspense: true })
  const { mutate: setValue } = useStorageMutation<TData>(key)

  React.useEffect(() => {
    if (isUndefined(value)) {
      setValue(defaultValue)
    }
  }, [])

  return [value, setValue]
}

export default useStorageStage
