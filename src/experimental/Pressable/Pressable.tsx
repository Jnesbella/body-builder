import * as React from "react";
import styled from "styled-components/native";
import {
  PanResponder,
  Pressable as DefaultPressable,
  View,
} from "react-native";

import {
  PressableState,
  PressableActions,
  PressableProvider,
  PressableProviderProps,
} from "./PressableContext";

export interface PressableProps {
  onPress?: () => void;
  disabled?: boolean;
  children?: PressableProviderProps["children"];
  isFocused?: PressableProviderProps["isFocused"];
}

const Pressable = React.forwardRef<View, PressableProps>(
  ({ children, isFocused, ...rest }, ref) => {
    // const panResponder = React.useRef(
    //   PanResponder.create({
    //     // onStartShouldSetPanResponderCapture: () => {
    //     //   // onPress?.();
    //     //   return false;
    //     // },
    //     // Ask to be the responder:
    //     onStartShouldSetPanResponder: () => false,
    //     onStartShouldSetPanResponderCapture: () => false,
    //     // onMoveShouldSetPanResponder: (evt, gestureState) => true,
    //     // onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
    //     //   true,
    //     // onPanResponderGrant: (evt, gestureState) => {
    //     //   // The gesture has started. Show visual feedback so the user knows
    //     //   // what is happening!
    //     //   // gestureState.d{x,y} will be set to zero now
    //     // },
    //     // onPanResponderMove: (evt, gestureState) => {
    //     //   // The most recent move distance is gestureState.move{X,Y}
    //     //   // The accumulated gesture distance since becoming responder is
    //     //   // gestureState.d{x,y}
    //     // },
    //     // onPanResponderTerminationRequest: (evt, gestureState) =>
    //     //   true,
    //     // onPanResponderRelease: (evt, gestureState) => {
    //     //   // The user has released all touches while this view is the
    //     //   // responder. This typically means a gesture has succeeded
    //     // },
    //     // onPanResponderTerminate: (evt, gestureState) => {
    //     //   // Another component has become the responder, so this gesture
    //     //   // should be cancelled
    //     // },
    //     // onShouldBlockNativeResponder: (evt, gestureState) => {
    //     //   // Returns whether this component should block native components from becoming the JS
    //     //   // responder. Returns true by default. Is currently only supported on android.
    //     //   return true;
    //     // }
    //   })
    // ).current;

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

    return (
      <DefaultPressable ref={ref} {...rest}>
        {(state) => (
          <PressableProvider
            children={children}
            state={state}
            isFocused={isFocused}
          />
        )}
      </DefaultPressable>
    );
  }
);

export default Pressable;
