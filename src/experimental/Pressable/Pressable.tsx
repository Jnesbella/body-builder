import * as React from "react";
import styled from "styled-components";
import {
  // PanResponder,
  // Pressable as DefaultPressable,
  View,
} from "react-native";

import PressableProvider, {
  PressableState,
  PressableActions,
  PressableProviderProps,
} from "./PressableProvider";

const DefaultPressable = styled.div``;

export interface PressableProps {
  onPress?: () => void;
  onPressCapture?: () => void;
  disabled?: boolean;
  children?: PressableProviderProps["children"];
  isFocused?: PressableProviderProps["isFocused"];
  onBlur?: PressableProviderProps["onBlur"];
  onFocus?: PressableProviderProps["onFocus"];
}

const Pressable = React.forwardRef<HTMLDivElement, PressableProps>(
  (
    { children, isFocused, onPress, disabled, onPressCapture, onFocus, onBlur },
    ref
  ) => {
    const [pressed, setPressed] = React.useState(false);
    const [hovered, setHovered] = React.useState(false);
    const [focused, setFocused] = React.useState(isFocused || false);

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
        focused: isFocused || focused,
        pressed,
      }),
      [pressed, hovered, focused, isFocused]
    );

    return (
      <DefaultPressable
        ref={ref}
        onClick={disabled ? undefined : onPress}
        onPointerOverCapture={() => setHovered(true)}
        onPointerOutCapture={() => setHovered(false)}
        onPointerDownCapture={() => setPressed(true)}
        onPointerUpCapture={() => setPressed(false)}
        onMouseDownCapture={
          disabled
            ? undefined
            : (_event) => {
                // event.stopPropagation();
                onPressCapture?.();
              }
        }
      >
        <PressableProvider
          defaultState={state}
          isFocused={isFocused}
          onBlur={onBlur}
          onFocus={onFocus}
        >
          {children}
        </PressableProvider>
      </DefaultPressable>
    );
  }
);

export default Pressable;
