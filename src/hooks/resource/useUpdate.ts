import * as React from "react";
import { useMutation, useQueryClient } from "react-query";

import { ResourceDocument, UpdateOne } from "../../services";

import { UseCRUD } from "./resourceHookTypes";
import { OnMutationSuccess } from "./resourceTypes";

function useUpdate<
  TDocument extends ResourceDocument,
  TPayload extends UpdateOne<TDocument> = UpdateOne<TDocument>
>({
  service,
  onSuccess,
}: UseCRUD<TDocument> & {
  onSuccess?: OnMutationSuccess<TDocument, unknown, TPayload>;
}) {
  const queryClient = useQueryClient();

  const doUpdate = React.useCallback(
    (payload: TPayload) => service.update<TPayload>(payload),
    []
  );

  const { mutateAsync: update, isLoading: isUpdating } = useMutation(doUpdate, {
    onSuccess: (nextData, variables, context) => {
      queryClient.setQueryData(service.getQueryKey(nextData.id), nextData);

      onSuccess?.(nextData, variables, context);
    },
  });

  return {
    update,
    isUpdating,
  };
}

export default useUpdate;
