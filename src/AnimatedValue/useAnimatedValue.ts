import * as React from "react";
import { Animated } from "react-native";
import { isEqual, isNumber } from "lodash";

import { AnimatedValueQuery } from "./animatedValueTypes";
import { log } from "../utils";
import useAnimatedValueQuery from "./useAnimatedValueQuery";
import useAnimatedValueId from "./useAnimatedValueId";
import useAnimatedValueDefaultValue from "./useAnimatedValueDefaultValue";

export const ANIMATED_VALUE_ELEMENT_STORAGE_PREFIX = "animatedValueElement-";

export function useAnimatedValue(
  query: AnimatedValueQuery,
  _defaultValue?: number
) {
  // const id = React.useMemo(() => makeAnimatedValueId(query), [query])
  const id = useAnimatedValueId(query);
  const defaultValue = useAnimatedValueDefaultValue(id, _defaultValue);
  const value = useAnimatedValueQuery(id, defaultValue);

  // const { findOne, createOne } = useAnimatedValueContext((context) => context)

  // const [element, setElement] = React.useState<AnimatedValueElement>()

  // React.useEffect(
  //   function handleElementChange() {
  //     if (element?.value) {
  //       animatedValueRef.current = element.value
  //     }
  //   },
  //   [element]
  // )

  // React.useEffect(
  //   function handleQueryChange() {
  //     let nextElement: AnimatedValueElement | undefined

  //     if (query) {
  //       try {
  //         nextElement = findOne({ ...query, id })
  //       } catch (error) {
  //         nextElement = createOne({
  //           ...query,
  //           id,
  //           value
  //         })
  //       } finally {
  //         if (!isEqual(element, nextElement)) {
  //           setElement(nextElement)
  //         }
  //       }
  //     }
  //   },
  //   [query, findOne, createOne, element, id]
  // )

  // const valueInPixels = usePersistAnimatedValue({
  //   key: id,
  //   value,
  //   enabled: false
  // })

  // const isNew = React.useRef(!isNumber(valueInPixels)).current

  // React.useEffect(
  //   function handleDefaultValue() {
  //     if (isNew && isNumber(defaultValue)) {
  //       value?.setValue(defaultValue)
  //     }
  //   },
  //   [isNew, value]
  // )

  return value;
}

export default useAnimatedValue;
