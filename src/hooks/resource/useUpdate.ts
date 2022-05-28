import * as React from "react";
import { useMutation, useQueryClient } from "react-query";

import { ResourceDocument } from "../../services";

import { UseCRUD } from "./resourceHookTypes";
import { OnMutationSuccess } from "./resourceTypes";

function useUpdate<
  TData extends ResourceDocument,
  K extends ResourceDocument = TData
>({
  service,
  onSuccess,
}: UseCRUD<TData> & { onSuccess?: OnMutationSuccess<TData> }) {
  const queryClient = useQueryClient();

  const doUpdate = React.useCallback(
    (payload: Partial<K> & { id: TData["id"] }) => service.update<K>(payload),
    []
  );

  const { mutateAsync: update, isLoading: isUpdating } = useMutation(doUpdate, {
    onSuccess: (nextData, ...rest) => {
      queryClient.setQueryData(service.getQueryKey(nextData.id), nextData);

      onSuccess?.(nextData, ...rest);
    },
  });

  return {
    update,
    isUpdating,
  };
}

export default useUpdate;
