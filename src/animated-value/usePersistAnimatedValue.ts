import { Animated } from "react-native";

import { useWatchAnimatedValue } from "../hooks";
import useStorageState from "../async-storage/deprecated/useStorageState";

export function usePersistAnimatedValue(
  key: string,
  animatedValue?: Animated.Value,
  defaultValue?: number,
  { enabled = true } = {}
) {
  const state = useWatchAnimatedValue(animatedValue, defaultValue);

  useStorageState(key, state, {
    enabled,
  });
}

export default usePersistAnimatedValue;
