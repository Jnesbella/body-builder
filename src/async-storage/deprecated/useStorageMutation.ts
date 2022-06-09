import { isUndefined } from "lodash";
import * as React from "react";
import { useQueryClient, useMutation, UseMutationOptions } from "react-query";

import useAsyncStorageState from "../useAsyncStorageState";

import { DEFAULT_STORAGE_KEY_PREFIX } from "./hooksConstants";
import { makeKey } from "./hooksUtils";

export type UseMutateStorageOptions<TData = any> = UseMutationOptions<
  void,
  unknown,
  TData | undefined,
  void
>;

function useStorageMutation<TData = any>(
  key: string,
  {
    keyPrefix = DEFAULT_STORAGE_KEY_PREFIX,
    ...options
  }: UseMutateStorageOptions<TData> & { keyPrefix?: string } = {}
) {
  const storage = useAsyncStorageState((state) => state.storage);

  const storageKey = makeKey([keyPrefix, key]);

  const queryClient = useQueryClient();

  const setItem = React.useCallback(
    (variables: TData | undefined) => {
      return new Promise<void>(async (resolve, reject) => {
        try {
          if (!isUndefined(variables)) {
            await storage.setItemAsync(key, variables);
          } else {
            /**
             * TODO: decide if this good
             *
             * alternative: let the item be set to undefined
             */
            await storage.deleteItemAsync(key);
          }

          resolve();
        } catch (err) {
          reject(err);
        }
      });
    },
    [key]
  );

  const mutation = useMutation(setItem, {
    ...options,
    onMutate: (variables) => {
      queryClient.setQueryData(storageKey, variables);
      options.onMutate?.(variables);
    },
  });

  return mutation;
}

export default useStorageMutation;
