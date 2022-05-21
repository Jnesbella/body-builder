import * as React from "react";
import { useQuery } from "react-query";
import { Animated } from "react-native";

function useAnimatedValueQuery(
  key: string,
  defaultValue: number = 0,
  { enabled = true } = {}
) {
  const loadItem = React.useCallback(
    () => new Animated.Value(defaultValue),
    [defaultValue]
  );

  const { data: value } = useQuery(key, loadItem, { suspense: true, enabled });

  return value as Animated.Value;
}

export default useAnimatedValueQuery;
