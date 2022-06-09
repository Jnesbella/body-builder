import * as React from "react";
import { Animated } from "react-native";
import { isEqual, isNumber } from "lodash";

import { log } from "../utils";

import { AnimatedValueQuery } from "./animatedValueTypes";
import useAnimatedValueQuery from "./useAnimatedValueQuery";
import useAnimatedValueId from "./useAnimatedValueId";
// import useAnimatedValueDefaultValue from "./useAnimatedValueDefaultValue";
// import usePersistAnimatedValue from "./usePersistAnimatedValue";

export const ANIMATED_VALUE_ELEMENT_STORAGE_PREFIX = "animatedValueElement-";

export function useAnimatedValue(
  query?: AnimatedValueQuery,
  // _defaultValue?: number,
  defaultValue?: number,
  { enabled = true } = {}
) {
  const id = useAnimatedValueId(query);

  // const defaultValue = useAnimatedValueDefaultValue(query, _defaultValue, {
  //   enabled,
  // });

  const value = useAnimatedValueQuery(id, defaultValue, { enabled });

  // usePersistAnimatedValue(id, value, defaultValue, { enabled });

  return enabled ? value : undefined;
}

export default useAnimatedValue;
