import * as React from "react";
import styled from "styled-components";
import {
  // PanResponder,
  // Pressable as DefaultPressable,
  View,
} from "react-native";

import {
  PressableState,
  PressableActions,
  PressableProvider,
  PressableProviderProps,
} from "./PressableContext";

const DefaultPressable = styled.div``;

export interface PressableProps {
  onPress?: () => void;
  disabled?: boolean;
  children?: PressableProviderProps["children"];
  isFocused?: PressableProviderProps["isFocused"];
}

const Pressable = React.forwardRef<HTMLDivElement, PressableProps>(
  ({ children, isFocused, onPress, disabled }, ref) => {
    const [pressed, setPressed] = React.useState(false);
    const [hovered, setHovered] = React.useState(false);
    const [focused, setFocused] = React.useState(false);

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
        focused,
        pressed,
      }),
      [pressed, hovered, focused]
    );

    return (
      <DefaultPressable
        ref={ref}
        onClick={disabled ? undefined : onPress}
        onPointerOverCapture={() => setHovered(true)}
        onPointerOutCapture={() => setHovered(false)}
        onPointerDownCapture={() => setPressed(true)}
        onPointerUpCapture={() => setPressed(false)}
      >
        <PressableProvider
          children={children}
          state={state}
          isFocused={isFocused}
        />
      </DefaultPressable>
    );
  }
);

export default Pressable;
