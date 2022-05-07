import { isNumber, isUndefined } from "lodash";
import * as React from "react";
import { Animated } from "react-native";

import {
  useStorageMutation,
  useStorageQuery,
  useWatchAnimatedValue,
} from "../hooks";

export function usePersistAnimatedValue({
  key: storageKey,
  value: animatedValue,
  enabled = true,
}: {
  key: string;
  value?: Animated.Value;
  enabled?: boolean;
}) {
  const { data: state } = useStorageQuery<number>(storageKey, { enabled });

  const { mutate: storeValue } = useStorageMutation<number>(storageKey);

  const value = useWatchAnimatedValue(animatedValue) || state;

  const isStorageOutOfSync = state !== value;

  React.useEffect(
    function handleValueChange() {
      if (enabled) {
        if (isStorageOutOfSync) {
          storeValue(value);
        }

        if (isNumber(value)) {
          animatedValue?.setValue(value);
        }
      }
    },
    [value, storeValue, enabled, isStorageOutOfSync, animatedValue]
  );

  return value;
}

export default usePersistAnimatedValue;
