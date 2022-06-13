import { isUndefined } from "lodash";

import useStorageQuery from "../async-storage/deprecated/useStorageQuery";
import { AnimatedValueQuery } from "./animatedValueTypes";
import useAnimatedValueId from "./useAnimatedValueId";

function useAnimatedValueDefaultValue(
  query?: AnimatedValueQuery,
  _defaultValue?: number,
  { enabled = true } = {}
) {
  const id = useAnimatedValueId(query);

  const { data: defaultValue } = useStorageQuery<number>(id, {
    suspense: true,
    enabled,
  });

  return !isUndefined(defaultValue) ? defaultValue : _defaultValue;
}

export default useAnimatedValueDefaultValue;
