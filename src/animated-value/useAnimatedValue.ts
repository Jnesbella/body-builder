import { QueryKey } from "react-query";

import useQueryAnimatedValue from "./useQueryAnimatedValue";
import useMutateAnimatedValue from "./useMutateAnimatedValue";

export function useAnimatedValue(
  queryKey: QueryKey,
  defaultValue?: number,
  { enabled = true } = {}
) {
  const value = useQueryAnimatedValue(queryKey, defaultValue, { enabled });

  useMutateAnimatedValue(queryKey, value, defaultValue, { enabled });

  return enabled ? value : undefined;
}

export default useAnimatedValue;
