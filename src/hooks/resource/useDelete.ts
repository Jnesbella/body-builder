import { useMutation, useQueryClient } from "react-query";

import { ResourceDocument, DeleteOne } from "../../services";

import { UseCRUD } from "./resourceHookTypes";
import { OnMutationSuccess } from "./resourceTypes";

function useDelete<
  TDocument extends ResourceDocument,
  TPayload extends DeleteOne<TDocument> = DeleteOne<TDocument>
>({
  service,
  onSuccess,
}: UseCRUD<TDocument> & {
  onSuccess?: OnMutationSuccess<void, unknown, TPayload>;
}) {
  const { mutateAsync: deleteOne, isLoading: isDeleting } = useMutation(
    (payload: TPayload) => service.deleteOne<TPayload>(payload),
    {
      onSuccess,
    }
  );

  return {
    deleteOne,
    isDeleting,
  };
}

export default useDelete;
