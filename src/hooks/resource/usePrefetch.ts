import * as React from "react";
import { QueryKey, useQueryClient } from "react-query";

function usePrefetch() {
  const queryClient = useQueryClient();

  const prefetch = React.useCallback(
    (queryKey: QueryKey, queryFn, ...rest) =>
      queryClient.prefetchQuery(queryKey, queryFn, ...rest),
    []
  );

  return prefetch;
}

export default usePrefetch;
