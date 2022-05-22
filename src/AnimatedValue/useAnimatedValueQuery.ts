import * as React from "react";
import { useQuery } from "react-query";
import { Animated } from "react-native";

function useAnimatedValueQuery(
  key: string,
  defaultValue: number = 0,
  { enabled = true } = {}
) {
  const ref = React.useRef(new Animated.Value(defaultValue)).current;
  const loadItem = React.useCallback(() => ref, []);

  const { data: value } = useQuery(key, loadItem, { suspense: true, enabled });

  return value;
}

export default useAnimatedValueQuery;
