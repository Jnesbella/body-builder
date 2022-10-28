import * as React from "react";
import styled, { css } from "styled-components";

import { log, setRef } from "../../utils";
import { useId } from "../../hooks";

import PressableProvider, {
  PressableProviderProps,
  PressableProviderElement,
} from "./PressableProvider";
import FocusProvider from "./FocusProvider";
import { full, Greedy, greedy } from "../../components";

const DefaultPressable = styled.div<{ fullWidth?: boolean } & Greedy>`
  ${greedy};
  ${full};
  ${greedy};

  user-select: none;
  display: inline-flex;
`;

export type PressableElement = HTMLDivElement;

export interface PressableProps
  extends Omit<PressableProviderProps, "id">,
    Greedy {
  disabled?: boolean;
  fullWidth?: boolean;
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
      fullWidth,
      focusOnPress = true,
      focusOn = focusOnPress ? "press" : "none",
      focusable: isFocusable = true,

      isFocused,
      isHovered,
      isPressed,

      id: idProp,
      greedy,

      ...pressableProviderProps
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

    const focusRef = React.useRef<(options?: FocusOptions) => void>();

    const blurRef = React.useRef<() => void>();

    const disabledCache = React.useRef(disabled);

    const isDisabledChanged = disabledCache.current !== disabled;

    React.useEffect(
      function cacheDisabled() {
        disabledCache.current = disabled;
      },
      [disabled]
    );

    React.useEffect(
      function handleChangeDisabled() {
        if (isDisabledChanged && disabled) {
          pressableProviderRef.current?.blur();
          pressableProviderRef.current?.hoverOut();
          pressableProviderRef.current?.pressOut();
        }
      },
      [disabled, isDisabledChanged, id]
    );

    return (
      <DefaultPressable
        ref={(node) => {
          const element = (node || {}) as PressableElement;

          if (!focusRef.current) {
            focusRef.current = element.focus;
          }

          if (!blurRef.current) {
            blurRef.current = element.blur;
          }

          element["blur"] = () => {
            // blurRef.current?.();
            pressableProviderRef.current?.blur();
          };

          element["focus"] = () => {
            // focusRef.current?.();
            pressableProviderRef.current?.focus();
          };

          setRef(ref, element);
        }}
        greedy={greedy}
        fullWidth={fullWidth}
        tabIndex={!disabled && isFocusable ? 0 : undefined}
        // focused
        onFocus={
          !disabled && isFocusable
            ? () => {
                pressableProviderRef.current?.focus();
              }
            : undefined
        }
        onBlur={
          !disabled && isFocusable
            ? () => {
                pressableProviderRef.current?.blur();
              }
            : undefined
        }
        // hovered
        onPointerOver={
          !disabled
            ? () => {
                pressableProviderRef.current?.hoverOver();
              }
            : undefined
        }
        onPointerOut={
          !disabled
            ? () => {
                pressableProviderRef.current?.hoverOut();
              }
            : undefined
        }
        // pressed
        onPointerDown={
          !disabled
            ? () => {
                pressableProviderRef.current?.pressIn();
              }
            : undefined
        }
        onPointerUp={
          !disabled
            ? () => {
                pressableProviderRef.current?.pressOut();
                pressableProviderProps.onPressCapture?.();
              }
            : undefined
        }
      >
        <PressableProvider
          {...pressableProviderProps}
          id={id}
          ref={pressableProviderRef}
          defaultState={state}
          isFocused={state.focused}
          isHovered={state.hovered}
          isPressed={state.pressed}
          onPress={() => {
            const result = pressableProviderProps.onPress?.();
            const preventFocus = result === false;

            if (isFocusOnPress && !preventFocus) {
              pressableProviderRef.current?.focus();
            }
          }}
        >
          {children}
        </PressableProvider>
      </DefaultPressable>
    );
  }
);

type Pressable = typeof Pressable & {
  Provider: typeof FocusProvider;
};

(Pressable as Pressable).Provider = FocusProvider;

export default Pressable as Pressable;
