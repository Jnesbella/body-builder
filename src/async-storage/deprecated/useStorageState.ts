import React from "react";
import { UseMutateFunction } from "react-query";

import useStorageMutation from "./useStorageMutation";
import { makeKey } from "./hooksUtils";
import { DEFAULT_STORAGE_KEY_PREFIX } from "./hooksConstants";

export type SetValue<TData = any> = UseMutateFunction<
  void,
  unknown,
  TData | undefined,
  void
>;

function useStorageState<TData = any>(
  key: string,
  value?: TData,
  { enabled = true, keyPrefix = DEFAULT_STORAGE_KEY_PREFIX } = {}
) {
  const { mutate: setValue } = useStorageMutation<TData>(key, { keyPrefix });

  React.useEffect(() => {
    if (enabled) {
      setValue(value);
    }
  }, [enabled, setValue, value]);

  return value;
}

export default useStorageState;
