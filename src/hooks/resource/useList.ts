import * as React from "react";
import { useQuery, useQueryClient } from "react-query";

import { ResourceDocument } from "../../Services";

import { UseCRUD } from "./resourceHookTypes";

function useList<T extends ResourceDocument>(
  { service }: UseCRUD<T>,
  payload?: any
) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(service.getQueryKey(), () =>
    service.list(payload)
  );

  const prefetch = React.useCallback(
    () =>
      queryClient.prefetchQuery(service.getQueryKey(), () => service.list()),
    []
  );

  return {
    data,
    prefetch,
    isLoading,
  };
}

export default useList;
