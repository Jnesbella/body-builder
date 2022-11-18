import * as React from "react";
import styled from "styled-components";

import { log, setRef } from "../../utils";
import { useId, useOnValueChange } from "../../hooks";

import PressableProvider, {
  PressableProviderProps,
  PressableProviderElement,
} from "./PressableProvider";
import FocusProvider from "./FocusProvider";
import { full, Full, greedy, Greedy } from "../../components";

export interface WithoutFeedbackProps extends Full, Greedy {}

const WithoutFeedback = styled.div<WithoutFeedbackProps>`
  ${greedy};
  ${full};

  user-select: none;
  display: inline-flex;
`;

export type PressableElement = HTMLDivElement;

export interface PressableProps
  extends Omit<PressableProviderProps, "id">,
    WithoutFeedbackProps {
  disabled?: boolean;
  focusOn?: "press" | "none";
  focusable?: boolean;
  focusOnPress?: boolean;
  id?: PressableProviderProps["id"];
}

const Pressable = React.forwardRef<PressableElement, PressableProps>(
  (
    {
      children,

      disabled,
      focusOnPress = true,
      focusOn = focusOnPress ? "press" : "none",
      focusable: isFocusable = true,

      isFocused,
      isHovered,
      isPressed,

      id: idProp,

      onPress,
      onBlur,
      onFocus,
      onHoverOut,
      onHoverOver,
      onLongPress,
      onPressCapture,

      fullHeight,
      fullWidth,
      greedy,

      // ...rest
    },
    ref
  ) => {
    const pressableProviderRef = React.useRef<PressableProviderElement>(null);

    const id = useId(idProp);

    const state = {
      hovered: isHovered,
      focused: isFocused,
      pressed: isPressed,
    };

    const isFocusOnPress = focusOn === "press";

    useOnValueChange(disabled, () => {
      if (disabled) {
        pressableProviderRef.current?.blur();
        pressableProviderRef.current?.hoverOut();
        pressableProviderRef.current?.pressOut();
      }
    });

    const tryAction = (key: keyof PressableProviderElement) => {
      return () => {
        const action = pressableProviderRef.current?.[key];

        if (!disabled && action && typeof action === "function") {
          action();
        }
      };
    };

    const innerRef = React.useRef<PressableElement>(null);

    const handleRef = (node: HTMLDivElement | null) => {
      const element = (node || {}) as PressableElement;

      const { focus: focusElement, blur: blurElement } = element || {};

      element.blur = () => {
        pressableProviderRef.current?.blur();
        blurElement?.();
      };

      element.focus = (_options?: FocusOptions) => {
        pressableProviderRef.current?.focus();
        focusElement?.();
      };

      setRef(innerRef, element);
      setRef(ref, element);
    };

    const handlePress = () => {
      const result = onPress?.();
      const preventFocus = result === false;

      if (isFocusOnPress && !preventFocus) {
        pressableProviderRef.current?.focus();
      }
    };

    return (
      <WithoutFeedback
        // {...rest}
        ref={handleRef}
        tabIndex={!disabled && isFocusable ? 0 : undefined}
        // focused
        onFocus={tryAction("focus")}
        onBlur={tryAction("blur")}
        // hovered
        onPointerOver={tryAction("hoverOver")}
        onPointerOut={tryAction("hoverOut")}
        // pressed
        onPointerDown={tryAction("pressIn")}
        onPointerUp={tryAction("pressOut")}
        fullHeight={fullHeight}
        fullWidth={fullWidth}
        greedy={greedy}
      >
        <PressableProvider
          id={id}
          ref={pressableProviderRef}
          defaultState={state}
          isFocused={state.focused}
          isHovered={state.hovered}
          isPressed={state.pressed}
          onPress={handlePress}
          onBlur={onBlur}
          onFocus={onFocus}
          onHoverOut={onHoverOut}
          onHoverOver={onHoverOver}
          onLongPress={onLongPress}
          onPressCapture={onPressCapture}
        >
          {children}
        </PressableProvider>
      </WithoutFeedback>
    );
  }
);

type Pressable = typeof Pressable & {
  Provider: typeof FocusProvider;
};

(Pressable as Pressable).Provider = FocusProvider;

export default Pressable as Pressable;
