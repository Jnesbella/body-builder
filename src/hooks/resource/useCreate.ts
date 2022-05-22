import * as React from "react";
import { useMutation, useQueryClient } from "react-query";

import { ResourceDocument } from "../../services";

import { UseCRUD } from "./resourceHookTypes";

function useCreate<T extends ResourceDocument, K extends ResourceDocument = T>({
  service,
}: UseCRUD<T>) {
  const queryClient = useQueryClient();

  const doCreate = React.useCallback(
    (payload: Partial<K> | undefined | void) => service.create(payload),
    []
  );

  const { mutateAsync: create, isLoading: isCreating } = useMutation(doCreate, {
    onSuccess: (data) => {
      // queryClient.invalidateQueries(service.getQueryKey());

      queryClient.setQueryData(service.getQueryKey(data.id), data);

      const maybeList = queryClient.getQueryData(service.getQueryKey());
      if (Array.isArray(maybeList)) {
        queryClient.setQueryData(service.getQueryKey(), [...maybeList, data]);
      }
    },
  });

  return {
    create,
    isCreating,
  };
}

export default useCreate;
