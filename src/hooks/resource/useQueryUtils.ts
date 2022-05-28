import * as React from "react";
import { QueryKey, useMutation, useQueryClient } from "react-query";
import { ResourceDocument } from "../../services";
import { UseCRUD } from "./resourceHookTypes";

function useQueryUtils() {
  const queryClient = useQueryClient();

  const setQueryDataFromList = <TData>(
    getQueryKey: (datum: TData) => QueryKey,
    data: TData[]
  ) => {
    data.forEach((datum) => {
      queryClient.setQueryData(getQueryKey(datum), datum);
    });
  };

  const updateListQueryData = <TData>(
    queryKey: QueryKey,
    getNextValue: (previousValue: TData[]) => TData[]
  ) => {
    const maybeList = queryClient.getQueryData(queryKey);

    if (Array.isArray(maybeList)) {
      const nextValue = getNextValue(maybeList);
      queryClient.setQueryData(queryKey, nextValue);
    }
  };

  const updateListQueryDataToAppendItem = <TData>(
    queryKey: QueryKey,
    data: TData
  ) => {
    return updateListQueryData<TData>(queryKey, (prevVal) => [
      ...prevVal,
      data,
    ]);
  };

  const updateListQueryDataToFilterItem = <TData extends ResourceDocument>(
    queryKey: QueryKey,
    data: TData
  ) => {
    return updateListQueryData<TData>(queryKey, (prevVal) =>
      prevVal.filter((item) => item.id !== data.id)
    );
  };

  const updateListQueryDataToSetItem = <TData extends ResourceDocument>(
    queryKey: QueryKey,
    data: TData
  ) => {
    return updateListQueryData<TData>(queryKey, (prevVal) =>
      prevVal.map((item) => (item.id === data.id ? data : item))
    );
  };

  return {
    setQueryDataFromList,
    updateListQueryData,
    updateListQueryDataToAppendItem,
    updateListQueryDataToFilterItem,
    updateListQueryDataToSetItem,
  };
}

export default useQueryUtils;
