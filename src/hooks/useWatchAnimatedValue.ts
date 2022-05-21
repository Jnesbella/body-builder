import * as React from "react";
import { Animated } from "react-native";
import useAnimatedValueListener from "./useAnimatedValueListener";

function useWatchAnimatedValue(
  animatedValue?: Animated.Value,
  defaultValue?: number
) {
  const [value, setValue] = React.useState<number | undefined>(defaultValue);

  const onAnimatedValueChange = React.useCallback(
    ({ value: nextValue }: { value: number }) => {
      setValue(nextValue);
    },
    []
  );

  useAnimatedValueListener(animatedValue, onAnimatedValueChange);

  return value;
}

export default useWatchAnimatedValue;
