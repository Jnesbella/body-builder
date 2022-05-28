import * as React from "react";
import { useMutation, useQueryClient } from "react-query";

import { ResourceDocument } from "../../services";

import { UseCRUD } from "./resourceHookTypes";
import { OnMutationSuccess } from "./resourceTypes";

function useCreate<
  TData extends ResourceDocument,
  K extends ResourceDocument = TData
>({
  service,
  onSuccess,
}: UseCRUD<TData> & { onSuccess?: OnMutationSuccess<TData> }) {
  const queryClient = useQueryClient();

  const doCreate = React.useCallback(
    (payload: Partial<K> | undefined | void) => service.create(payload),
    [service]
  );

  const { mutateAsync: create, isLoading: isCreating } = useMutation(doCreate, {
    onSuccess: (data, ...rest) => {
      queryClient.setQueryData(service.getQueryKey(data.id), data);

      onSuccess?.(data, ...rest);
    },
  });

  return {
    create,
    isCreating,
  };
}

export default useCreate;
