import * as React from "react";
import { isNumber, isUndefined } from "lodash";
import styled from "styled-components/native";
import { Animated } from "react-native";

import Grip from "./FlubberGrip";
import Slide from "./FlubberSlide";
import { AnimatedValueQuery, useAnimatedValue } from "../../AnimatedValue";
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
}

const Flubber = React.forwardRef<FlubberElement, FlubberProps>(
  (
    {
      width: widthProp,
      height: heightProp,
      children,
      defaultWidth,
      defaultHeight,
    },
    ref
  ) => {
    const width = useAnimatedValue(widthProp, defaultWidth);
    const height = useAnimatedValue(heightProp, defaultHeight);
    const [initialized, setInitialized] = React.useState(false);

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
          if (!initialized && width && height) {
            Animated.event([{ width, height }], {
              useNativeDriver: false,
            })({
              width: isNumber(defaultWidth)
                ? defaultWidth
                : event.nativeEvent.layout.width,
              height: isNumber(defaultHeight)
                ? defaultHeight
                : event.nativeEvent.layout.height,
            });

            setInitialized(true);
          }
        }}
        style={[
          initialized
            ? { width, height }
            : {
                flex: 1,
                maxWidth: isNumber(defaultWidth) ? defaultWidth : undefined,
                maxHeight: isNumber(defaultHeight) ? defaultHeight : undefined,
              },
          { overflow: "hidden" },
        ]}
      >
        {children}
      </FlubberContainer>
    );
  }
);

type Flubber = typeof Flubber & { Grip: typeof Grip; Slide: typeof Slide };
(Flubber as Flubber).Grip = Grip;
(Flubber as Flubber).Slide = Slide;

export default Flubber as Flubber;
