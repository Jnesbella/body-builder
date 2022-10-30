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

function useList<T extends ResourceDocument>(
  {
    service,
    onSuccess,
    queryKey: _queryKey,
  }: UseCRUD<T> & { onSuccess?: (data: T[]) => void; queryKey?: QueryKey },
  payload?: any
) {
  const queryClient = useQueryClient();

  const queryKey = _queryKey || service.getQueryKey();

  const { data: resources = [], isLoading } = useQuery(
    queryKey,
    () => service.list(payload),
    {
      suspense: true,
      onSuccess,
    }
  );

  const queries: UseQueryOptions[] = resources.map((value) => ({
    queryKey: service.getQueryKey(value.id),
    queryFn: () => service.get(value.id),
    suspense: true,
  }));

  const results = useQueries(queries);

  const data = results.map((result) => result.data);

  const prefetch = React.useCallback(
    <P>(p?: P) =>
      queryClient.prefetchQuery(queryKey, () => service.list(p || payload)),
    [payload, service]
  );

  const { updateListQueryDataToAppendItem, updateListQueryDataToFilterItem } =
    useQueryUtils();

  const onCreateSuccess: OnMutationSuccess = React.useCallback(
    (data) => updateListQueryDataToAppendItem(queryKey, data),
    [queryKey, updateListQueryDataToAppendItem]
  );

  const onDeleteSuccess: OnMutationSuccess = React.useCallback(
    (_, variables) => updateListQueryDataToFilterItem(queryKey, variables),
    [queryKey, updateListQueryDataToFilterItem]
  );

  return {
    data,
    prefetch,
    isLoading,
    onCreateSuccess,
    onDeleteSuccess,
  };
}

export default useList;
