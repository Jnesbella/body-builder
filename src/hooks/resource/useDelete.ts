import { useMutation, useQueryClient } from "react-query";

import { ResourceDocument } from "../../services";

import { UseCRUD } from "./resourceHookTypes";
import { OnMutationSuccess } from "./resourceTypes";

function useDelete<TData extends ResourceDocument>({
  service,
  onSuccess,
}: UseCRUD<TData> & {
  onSuccess?: OnMutationSuccess;
}) {
  const { mutateAsync: deleteOne, isLoading: isDeleting } = useMutation(
    (payload: TData) => service.deleteOne(payload),
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
