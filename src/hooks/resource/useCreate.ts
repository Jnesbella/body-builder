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
    onSuccess: () => {
      queryClient.invalidateQueries(service.getQueryKey());
    },
  });

  return {
    create,
    isCreating,
  };
}

export default useCreate;
