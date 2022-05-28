import * as React from "react";
import { useQuery, useQueryClient } from "react-query";

import { ResourceDocument } from "../../services";

import { UseCRUD } from "./resourceHookTypes";
import { OnQuerySuccess } from "./resourceTypes";

function useRead<TData extends ResourceDocument>({
  service,
  id,
  onSuccess,
}: UseCRUD<TData> & { onSuccess?: OnQuerySuccess<TData> }) {
  const queryClient = useQueryClient();

  const { data, isLoading: isReading } = useQuery(
    service.getQueryKey([id]),
    () => {
      if (id) {
        return service.fetch({ id });
      }

      throw new Error("id is required");
    },
    {
      enabled: !!id,
      suspense: true,
      onSuccess,
    }
  );

  const prefetch = React.useCallback(
    ({ id: innerId }: { id: TData["id"] }) =>
      queryClient.prefetchQuery(service.getQueryKey(id), () =>
        service.fetch({ id: innerId })
      ),
    []
  );

  return {
    data,
    prefetch,
    isReading,
  };
}

export default useRead;
