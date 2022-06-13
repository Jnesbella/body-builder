import * as React from "react";
import { isNumber, isUndefined } from "lodash";
import styled from "styled-components/native";
import { Animated } from "react-native";

import {
  AnimatedValueQuery,
  useAnimatedValue,
  useAnimatedValueDefaultValue,
} from "../../animated-value";
import { useWatchAnimatedValue } from "../../hooks";

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
    const isGreedy = isGreedyHeight || isGreedyWidth;

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

    React.useEffect(function setDefaultSizeOnMount() {
      if (defaultWidth) {
        width?.setValue(defaultWidth);
      }

      if (defaultHeight) {
        height?.setValue(defaultHeight);
      }
    }, []);

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
          if (!initialized && height) {
            const { height: h } = event.nativeEvent.layout;

            if (h && !heightValue) {
              height.setValue(h);
            }
          }

          if (!initialized && width) {
            const { width: w } = event.nativeEvent.layout;

            if (w && !widthValue) {
              width.setValue(w);
            }
          }
        }}
        style={[
          initialized
            ? { width, height }
            : { flex: 1, maxHeight: defaultHeight, maxWidth: defaultWidth },
          {
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
