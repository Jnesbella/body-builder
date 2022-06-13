import * as React from "react";
import { PanResponder, Animated } from "react-native";
import styled from "styled-components/native";
import { faGripVertical as icon } from "@fortawesome/free-solid-svg-icons/faGripVertical";

import { theme } from "../../styles";
import { OrientationProp, SizeProp } from "../../types";
import { useAnimatedValue, AnimatedValueQuery } from "../../animated-value";

import {
  flexible,
  Flexible,
  JustifyContent,
  full,
  Full,
  SpacingProps,
  background,
  Background,
  rounded,
  greedy,
  Greedy,
} from "../styled-components";
import Icon from "../Icon";
import Layout from "../Layout";

import useFlubberGripSize from "./useFlubberGripSize";

interface GripContainerProps
  extends Flexible,
    Full,
    SpacingProps,
    Background,
    Greedy {
  dragging?: boolean;
  width?: AnimatedValueQuery;
  orientation?: OrientationProp;
}

const FlubberGripContainer = styled(Layout.Box).attrs<GripContainerProps>(
  ({ dragging, ...rest }) => ({
    ...rest,
    fullHeight: true,
    justifyContent: JustifyContent.Center,
    // spacingSize: 0.5,
    background: dragging ? theme.colors.backgroundDisabled : undefined,
  })
)<GripContainerProps>`
  ${full};
  ${flexible};
  ${background};
  ${rounded};
  ${greedy};

  z-index: ${theme.zIndex.aboveAll};
  cursor: ${({ orientation }: GripContainerProps) => {
    if (orientation === "vertical") {
      return "col-resize";
    }

    if (orientation === "horizontal") {
      return "row-resize";
    }
  }};
`;

export interface FlubberGripElement {}

export interface FlubberGripProps {
  pushAndPull: [AnimatedValueQuery, AnimatedValueQuery];
  size?: SizeProp;
  enabled?: boolean;
  orientation?: OrientationProp;
  greedy?: boolean;
}

const FlubberGrip = React.forwardRef<FlubberGripElement, FlubberGripProps>(
  (
    {
      pushAndPull,
      enabled = true,
      size = "small",
      orientation = "vertical",
      greedy,
    },
    ref
  ) => {
    const [queryA, queryB] = pushAndPull;

    const valueA = useAnimatedValue(queryA);
    const valueB = useAnimatedValue(queryB);

    const [dragging, setDragging] = React.useState(false);

    const isHorizontal = orientation === "horizontal";
    const isVertical = orientation === "vertical";

    const gripSize = useFlubberGripSize(size);

    const isIconVisible = !["xsmall", "small"].includes(size);

    const element = React.useMemo<FlubberGripElement | null>(() => ({}), []);
    React.useEffect(function handleRef() {
      if (ref && "current" in ref) {
        ref.current = element;
      } else {
        ref?.(element);
      }
    });

    const panResponder = React.useMemo(
      () =>
        PanResponder.create({
          onMoveShouldSetPanResponder: () => enabled && !!element,

          onPanResponderGrant: () => {
            setDragging(true);

            valueA?.extractOffset();
            valueB?.extractOffset();
          },

          onPanResponderMove: (e, gestureState) => {
            if (isVertical) {
              if (valueA) {
                Animated.event([null, { dx: valueA }], {
                  useNativeDriver: false,
                })(e, { ...gestureState, dx: gestureState.dx });
              }

              if (valueB) {
                Animated.event([null, { dx: valueB }], {
                  useNativeDriver: false,
                })(e, { ...gestureState, dx: -gestureState.dx });
              }
            } else if (isHorizontal) {
              if (valueA) {
                Animated.event([null, { dy: valueA }], {
                  useNativeDriver: false,
                })(e, { ...gestureState, dy: gestureState.dy });
              }

              if (valueB) {
                Animated.event([null, { dy: valueB }], {
                  useNativeDriver: false,
                })(e, { ...gestureState, dy: -gestureState.dy });
              }
            }
          },

          onPanResponderRelease: () => {
            setDragging(false);

            valueA?.flattenOffset();
            valueB?.flattenOffset();
          },
        }),
      [valueA, valueB, enabled, element, isVertical, isHorizontal]
    );

    // if (!grip) {
    //   return null
    // }

    return (
      <FlubberGripContainer
        {...panResponder.panHandlers}
        dragging={dragging}
        style={isVertical ? { width: gripSize } : { height: gripSize }}
        greedy={greedy}
        orientation={orientation}
      >
        {isIconVisible && <Icon icon={icon} />}
      </FlubberGripContainer>
    );
  }
);

export default FlubberGrip;
