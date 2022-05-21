import * as React from "react";
import { isNumber, isUndefined } from "lodash";
import styled from "styled-components/native";
import { Animated } from "react-native";

import {
  AnimatedValueQuery,
  useAnimatedValue,
  useAnimatedValueDefaultValue,
} from "../../AnimatedValue";
import { useWatchAnimatedValue } from "../../hooks";
import { log } from "../../utils";

const FlubberContainer = styled(Animated.View)``;

export interface FlubberElement {}

export interface FlubberProps {
  children?: React.ReactNode;
  width: AnimatedValueQuery;
  defaultWidth?: number;
  height: AnimatedValueQuery;
  defaultHeight?: number;
  autoLayout?: boolean;
  greedy?: boolean | "height" | "width";
}

const Flubber = React.forwardRef<FlubberElement, FlubberProps>(
  (
    {
      width: widthProp,
      height: heightProp,
      children,
      defaultWidth: _defaultWidth,
      defaultHeight: _defaultHeight,
      greedy,
    },
    ref
  ) => {
    const isGreedyHeight = greedy === "height";
    const isGreedyWidth = greedy === "width";

    const defaultWidth = useAnimatedValueDefaultValue(widthProp, _defaultWidth);
    const width = useAnimatedValue(widthProp, defaultWidth);
    const widthValue = useWatchAnimatedValue(width, defaultWidth);

    const defaultHeight = useAnimatedValueDefaultValue(
      heightProp,
      _defaultHeight
    );
    const height = useAnimatedValue(heightProp, defaultHeight);
    const heightValue = useWatchAnimatedValue(height, defaultHeight);

    const initialized = !!widthValue && !!heightValue;

    const element = React.useMemo(() => ({}), []);
    React.useEffect(function handleRef() {
      if (ref && "current" in ref) {
        ref.current = element;
      } else {
        ref?.(element);
      }
    });

    return (
      <FlubberContainer
        onLayout={(event) => {
          if ((!initialized || isGreedyHeight) && height) {
            const { height: h } = event.nativeEvent.layout;

            if ((h && !heightValue) || isGreedyHeight) {
              height.setValue(h);
            }
          }

          if ((!initialized || isGreedyWidth) && width) {
            const { width: w } = event.nativeEvent.layout;

            if ((w && !widthValue) || isGreedyWidth) {
              width.setValue(w);
            }
          }
        }}
        style={[
          initialized && !isGreedyWidth && { width },
          initialized && !isGreedyHeight && { height },
          {
            flex: 1,
            maxWidth: !isGreedyWidth ? defaultWidth : undefined,
            maxHeight: !isGreedyHeight ? defaultHeight : undefined,
            overflow: "hidden",
          },
        ]}
      >
        {children}
      </FlubberContainer>
    );
  }
);

export default Flubber;
