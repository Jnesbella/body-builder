import { isUndefined } from "lodash";
import { QueryKey, UseQueryOptions } from "react-query";

import { useStorageQuery } from "../hooks";

function useAnimatedValueDefaultValue(key: string, _defaultValue: number = 0) {
  const { data: defaultValue } = useStorageQuery<number>(key, {
    suspense: true,
  });

  return !isUndefined(defaultValue) ? defaultValue : _defaultValue;
}

export default useAnimatedValueDefaultValue;
