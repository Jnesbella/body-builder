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

export interface PressableProps extends PressableProviderProps {
  disabled?: boolean;
  fullWidth?: boolean;
  focusOn?: "press" | "none";
  focusable?: boolean;
  focusOnPress?: boolean;
  // preventDefault?: boolean;
  // stopPropagation?: boolean;
}

const Pressable = React.forwardRef<HTMLDivElement, PressableProps>(
  (
    {
      children,

      disabled,
      fullWidth,
      focusOnPress = true,
      focusOn = focusOnPress ? "press" : "none",
      focusable: isFocusable = true,

      isFocused,
      isHovered,
      isPressed,

      ...pressableProviderProps
    },
    ref
  ) => {
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

    const state = {
      hovered: isHovered,
      focused: isFocused,
      pressed: isPressed,
    };

    // const hasPressHandler = [
    //   pressableProviderProps.onPress,
    //   pressableProviderProps.onPressCapture,
    //   pressableProviderProps.onLongPress,
    // ].some((handler) => !!handler);

    const isFocusOnPress = focusOn === "press";

    return (
      <DefaultPressable
        ref={ref}
        fullWidth={fullWidth}
        tabIndex={!disabled && isFocusable ? 0 : undefined}
        // tabIndex={0}

        // focused
        onFocus={
          !disabled && isFocusable
            ? () => {
                innerRef.current?.focus();
              }
            : undefined
        }
        onBlur={
          !disabled && isFocusable
            ? () => {
                innerRef.current?.blur();
              }
            : undefined
        }
        // hovered
        onPointerOver={
          !disabled
            ? () => {
                innerRef.current?.hoverOver();
              }
            : undefined
        }
        onPointerOut={
          !disabled
            ? () => {
                innerRef.current?.hoverOut();
              }
            : undefined
        }
        // pressed
        onPointerDown={
          !disabled
            ? () => {
                innerRef.current?.pressIn();
              }
            : undefined
        }
        onPointerUp={
          !disabled
            ? () => {
                innerRef.current?.pressOut();
                pressableProviderProps.onPressCapture?.();
              }
            : undefined
        }
      >
        <PressableProvider
          {...pressableProviderProps}
          ref={innerRef}
          defaultState={state}
          isFocused={state.focused}
          isHovered={state.hovered}
          isPressed={state.pressed}
          onPress={() => {
            const result = pressableProviderProps.onPress?.();
            const preventFocus = result === false;

            if (isFocusOnPress && !preventFocus) {
              innerRef.current?.focus();
            }
          }}
        >
          {children}
        </PressableProvider>
      </DefaultPressable>
    );
  }
);

export default Pressable;
