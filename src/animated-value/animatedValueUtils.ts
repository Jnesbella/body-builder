import { QueryKey } from "react-query";

export const queryKeyToString = (queryKey: QueryKey) => {
  if (typeof queryKey === "string") {
    return queryKey;
  }

  return queryKey.map((part) => JSON.stringify(part)).join("-");
};
