import * as React from "react";
import { Animated } from "react-native";
import { QueryKey, useMutation } from "react-query";

import { useAsyncStorageState } from "../async-storage";
import { useWatchAnimatedValue } from "../hooks";

import { queryKeyToString } from "./animatedValueUtils";

export function useMutateAnimatedValue(
  queryKey: QueryKey,
  animatedValue?: Animated.Value,
  defaultValue?: number,
  { enabled = true } = {}
) {
  const state = useWatchAnimatedValue(animatedValue, defaultValue);

  const storageKey = queryKeyToString(queryKey);

  const storage = useAsyncStorageState((state) => state.storage);

  const { mutate: storeAnimatedValue } = useMutation(
    async (nextValue?: number) => {
      await storage.setItemAsync(storageKey, JSON.stringify(nextValue));
    }
  );

  React.useEffect(
    function handleStateChange() {
      if (enabled) {
        storeAnimatedValue(state);
      }
    },
    [storeAnimatedValue, state, enabled]
  );
}

export default useMutateAnimatedValue;
