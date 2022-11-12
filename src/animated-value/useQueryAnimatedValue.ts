import * as React from "react";
import { Animated } from "react-native";
import { QueryKey, useQuery } from "react-query";
import { isNil, isNumber } from "lodash";

import { useAsyncStorageState } from "../async-storage";

import { queryKeyToString } from "./animatedValueUtils";

function useQueryAnimatedValue(
  queryKey?: QueryKey,
  defaultValue: number = 0,
  { enabled = true } = {}
) {
  const valueRef = React.useRef<Animated.Value>();

  const storageKey = queryKeyToString(queryKey);

  const storage = useAsyncStorageState((state) => state.storage);

  const loadItem = async () => {
    const storageValueRaw = storageKey
      ? await storage.getItemAsync(storageKey)
      : null;
    const storageValue = storageValueRaw ? JSON.parse(storageValueRaw) : null;

    valueRef.current = new Animated.Value(
      isNumber(storageValue) ? storageValue : defaultValue
    );

    return valueRef.current;
  };

  const { data: value } = useQuery(queryKey as QueryKey, loadItem, {
    suspense: true,
    enabled: enabled && !isNil(queryKey),
  });

  return value;
}

export default useQueryAnimatedValue;
