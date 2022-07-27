import * as React from "react";
import styled, { css } from "styled-components";
import {
  // PanResponder,
  // Pressable as DefaultPressable,
  View,
} from "react-native";

import PressableProvider, {
  PressableState,
  PressableActions,
  PressableProviderProps,
  PressableProviderElement,
} from "./PressableProvider";
import { log } from "../../utils";

const DefaultPressable = styled.div<{ fullWidth?: boolean }>`
  user-select: none;

  ${({ fullWidth }) => {
    if (fullWidth) {
      return css`
        width: 100%;
      `;
    }

    return "";
  }}
`;

export interface PressableProps {
  onPress?: () => void;
  onPressCapture?: () => void;
  onPointerDownCapture?: () => void;
  disabled?: boolean;
  children?: PressableProviderProps["children"];
  isFocused?: PressableProviderProps["isFocused"];
  onBlur?: PressableProviderProps["onBlur"];
  onFocus?: PressableProviderProps["onFocus"];
  preventDefault?: boolean;
  stopPropagation?: boolean;
  fullWidth?: boolean;
  focusOnPress?: boolean;
  focusOnPressCapture?: boolean;
  focusMode?: "controlled" | "uncontrolled";
}

const Pressable = React.forwardRef<HTMLDivElement, PressableProps>(
  (
    {
      children,
      isFocused,
      onPress,
      disabled,
      onPressCapture,
      onFocus,
      onBlur,
      stopPropagation,
      preventDefault,
      fullWidth,
      focusOnPress,
      focusOnPressCapture,
      focusMode: focusModeProp,
      onPointerDownCapture,
    },
    ref
  ) => {
    const [pressed, setPressed] = React.useState(false);
    const [hovered, setHovered] = React.useState(false);

    const innerRef = React.useRef<PressableProviderElement>(null);

    // return (
    //   <React.Fragment>
    //     <PressableProvider
    //       children={children}
    //       state={{
    //         hovered: false,
    //         focused: false,
    //         pressed: false,
    //       }}
    //       isFocused={isFocused}
    //     />
    //   </React.Fragment>
    // );

    const state = React.useMemo(
      () => ({
        hovered,
        focused: isFocused,
        pressed,
      }),
      [pressed, hovered, isFocused]
    );

    const focusMode =
      focusModeProp ||
      (!onPress && !onPressCapture && !onPointerDownCapture
        ? "controlled"
        : "uncontrolled");
    const isFocusable = focusMode === "uncontrolled";

    return (
      <DefaultPressable
        fullWidth={fullWidth}
        ref={ref}
        tabIndex={!disabled && isFocusable ? 0 : undefined}
        onFocus={
          !disabled && isFocusable
            ? () => {
                // window.setTimeout(() => {
                console.log("FOCUS");
                innerRef.current?.focus();
                // }, 0);
              }
            : undefined
        }
        onBlur={
          !disabled && isFocusable
            ? () => {
                // window.setTimeout(() => {
                console.log("BLUR");
                innerRef.current?.blur();
                // }, 1);
              }
            : undefined
        }
        onClickCapture={
          !disabled && isFocusable
            ? (event) => {
                if (onPressCapture) {
                  console.log("ON PRESS CAPTURE");

                  if (preventDefault) {
                    event.preventDefault();
                  }

                  if (stopPropagation) {
                    event.stopPropagation();
                  }

                  onPressCapture();

                  if (focusOnPressCapture) {
                    innerRef.current?.focus();
                  }
                }
              }
            : undefined
        }
        onClick={
          !disabled && isFocusable
            ? (event) => {
                if (onPress) {
                  console.log("ON PRESS");

                  if (preventDefault) {
                    event.preventDefault();
                  }

                  if (stopPropagation) {
                    event.stopPropagation();
                  }

                  onPress();

                  if (focusOnPress) {
                    innerRef.current?.focus();
                  }
                }
              }
            : undefined
        }
        onPointerOverCapture={() => setHovered(true)}
        onPointerOutCapture={() => setHovered(false)}
        onPointerDownCapture={() => {
          onPointerDownCapture?.();
          setPressed(true);
        }}
        onPointerUpCapture={() => setPressed(false)}
      >
        <PressableProvider
          defaultState={state}
          isFocused={isFocused}
          onBlur={onBlur}
          onFocus={onFocus}
          ref={innerRef}
        >
          {children}
        </PressableProvider>
      </DefaultPressable>
    );
  }
);

export default Pressable;
