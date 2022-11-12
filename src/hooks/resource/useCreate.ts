import * as React from "react";
import { useMutation, useQueryClient } from "react-query";

import { ResourceDocument, CreateOne } from "../../services";

import { UseCRUD } from "./resourceHookTypes";
import { OnMutationSuccess } from "./resourceTypes";

function useCreate<
  TDocument extends ResourceDocument,
  TPayload extends CreateOne<TDocument> = CreateOne<TDocument>
>({
  service,
  onSuccess,
}: UseCRUD<TDocument> & {
  onSuccess?: OnMutationSuccess<TDocument, unknown, TPayload>;
}) {
  const queryClient = useQueryClient();

  const doCreate = React.useCallback(
    (payload: TPayload) => service.create(payload),
    [service]
  );

  const { mutateAsync: create, isLoading: isCreating } = useMutation(doCreate, {
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(service.getQueryKey(data.id), data);

      onSuccess?.(data, variables, context);
    },
  });

  return {
    create,
    isCreating,
  };
}

export default useCreate;
