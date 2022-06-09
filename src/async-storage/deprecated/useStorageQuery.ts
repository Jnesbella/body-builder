import * as React from "react";
import { isString } from "lodash";
import { QueryKey, useQuery, UseQueryOptions } from "react-query";

import useAsyncStorageState from "../useAsyncStorageState";

import { makeKey } from "./hooksUtils";
import { DEFAULT_STORAGE_KEY_PREFIX } from "./hooksConstants";

export type UseQueryStorageOtpions<TData = any> = UseQueryOptions<
  TData,
  unknown,
  TData,
  QueryKey
>;

function useStorageQuery<TData = any>(
  key: string,
  {
    keyPrefix = DEFAULT_STORAGE_KEY_PREFIX,
    ...options
  }: UseQueryStorageOtpions<TData> & { keyPrefix?: string } = {}
) {
  const storage = useAsyncStorageState((state) => state.storage);

  const loadItem = React.useCallback(async (): Promise<TData | undefined> => {
    await storage.deleteItemAsync(key);
    const item = await storage.getItemAsync(key);
    return (item || undefined) as TData | undefined;
  }, [storage, key]);

  const storageKey = makeKey([keyPrefix, key]);
  const query = useQuery(storageKey, loadItem, {
    ...options,
  });

  return query;
}

export default useStorageQuery;
