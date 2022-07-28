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
      ([onPress, onPressCapture, onPointerDownCapture].some(
        (handler) => !!handler
      )
        ? "uncontrolled"
        : "controlled");

    const isFocusable = focusMode === "uncontrolled";

    const handleEvent = (callback?: () => void) =>
      !disabled && isFocusable
        ? (
            event:
              | React.FocusEvent<HTMLDivElement, Element>
              | React.MouseEvent<HTMLDivElement, MouseEvent>
          ) => {
            if (preventDefault) {
              event.preventDefault();
            }

            if (stopPropagation) {
              event.stopPropagation();
            }

            callback?.();
          }
        : undefined;

    return (
      <DefaultPressable
        fullWidth={fullWidth}
        ref={ref}
        tabIndex={!disabled && isFocusable ? 0 : undefined}
        onFocus={handleEvent(() => {
          innerRef.current?.focus();
        })}
        onBlur={handleEvent(() => {
          console.log("BLUR");
          innerRef.current?.blur();
        })}
        onClickCapture={
          onPressCapture &&
          handleEvent(() => {
            onPressCapture();

            if (focusOnPressCapture) {
              innerRef.current?.focus();
            }
          })
        }
        onClick={
          onPress &&
          handleEvent(() => {
            onPress();

            if (focusOnPress) {
              innerRef.current?.focus();
            }
          })
        }
        onPointerDownCapture={() => {
          onPointerDownCapture?.();
        }}
        // hovered
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        // pressed
        onPointerDown={() => setPressed(false)}
        onPointerUp={() => setPressed(false)}
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
