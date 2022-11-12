import * as React from "react";
import {
  useQuery,
  useQueryClient,
  QueryKey,
  useQueries,
  UseQueryOptions,
} from "react-query";

import { ResourceDocument } from "../../services";

import { UseCRUD } from "./resourceHookTypes";
import { OnMutationSuccess } from "./resourceTypes";
import useQueryUtils from "./useQueryUtils";

function useList<TData extends ResourceDocument>(
  {
    service,
    onSuccess,
    queryKey: queryKeyProp,
  }: UseCRUD<TData> & {
    onSuccess?: (data: TData[]) => void;
    queryKey?: QueryKey;
  },
  payload?: any
) {
  const queryClient = useQueryClient();

  const queryKey = queryKeyProp || service.getQueryKey();

  const { data: resources = [], isLoading } = useQuery<TData[]>(
    queryKey,
    () => service.list(payload),
    {
      suspense: true,
      onSuccess,
    }
  );

  // const queries: UseQueryOptions[] = resources.map((value) => ({
  //   queryKey: service.getQueryKey(value.id),
  //   queryFn: () => service.get(value.id),
  //   suspense: true,
  // }));

  // const results = useQueries(queries);

  // const data = results.map((result) => result.data);

  const prefetch = React.useCallback(
    <P>(p?: P) =>
      queryClient.prefetchQuery(queryKey, () => service.list(p || payload)),
    [payload, service]
  );

  const {
    updateListQueryDataToAppendItem,
    updateListQueryDataToFilterItem,
    updateListQueryDataToSetItem,
  } = useQueryUtils();

  const onCreateSuccess: OnMutationSuccess = React.useCallback(
    (nextData) => updateListQueryDataToAppendItem(queryKey, nextData),
    [queryKey, updateListQueryDataToAppendItem]
  );

  const onDeleteSuccess: OnMutationSuccess = React.useCallback(
    (_, variables) => updateListQueryDataToFilterItem(queryKey, variables),
    [queryKey, updateListQueryDataToFilterItem]
  );

  const onUpdateSuccess: OnMutationSuccess = React.useCallback(
    (nextData) => updateListQueryDataToSetItem(queryKey, nextData),
    [queryKey, updateListQueryDataToSetItem]
  );

  return {
    data: resources,
    // data,
    prefetch,
    isLoading,
    onCreateSuccess,
    onDeleteSuccess,
    onUpdateSuccess,
  };
}

export default useList;
