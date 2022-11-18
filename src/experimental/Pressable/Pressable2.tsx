import * as React from "react";
import { debounce, DebouncedFunc } from "lodash";

import { useId, useOnValueChange, useSetRef } from "../../hooks";

import FocusProvider, { useFocusActions } from "./FocusProvider";
import { PressableState } from "./PressableState";
import { PressableActions } from "./PressableActions";
import { PressableElement, RenderPressableChildren } from "./pressable-types";
import { renderPressableChildren } from "./pressable-utils";
import PressableWithFeedback from "./PressableWithFeedback";

export type BlurHandler = DebouncedFunc<() => void>;

const DEFAULT_STATE: PressableState = {
  pressed: false,
};

export interface PressableProps {
  children?: React.ReactNode | RenderPressableChildren;
  id?: string;
  defaultState?: Partial<PressableState>;
  disabled?: boolean;
  focusOn?: "press" | "none";
  focusable?: boolean;
  focusOnPress?: boolean;

  // focused
  isFocused?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  blurDebounceWait?: number;

  // pressed
  isPressed?: boolean;
  onPress?: () => void | boolean;
  onPressCapture?: () => void;
  onLongPress?: () => void;

  // hovered
  isHovered?: boolean;
  onHoverOver?: () => void;
  onHoverOut?: () => void;
}

const Pressable = React.forwardRef<PressableElement, PressableProps>(
  (
    {
      children,
      id: idProp,
      defaultState = DEFAULT_STATE,
      disabled,
      focusOnPress = true,
      focusOn = focusOnPress ? "press" : "none",
      focusable: isFocusable = true,

      onBlur,
      onFocus,
      blurDebounceWait = 0,

      onPress,
      // onPressCapture,
      // onLongPress,

      onHoverOver,
      onHoverOut,

      isFocused: isFocusedProp,
      isPressed: isPressedProp,
      isHovered: isHoveredProp,

      ...rest
    },
    ref
  ) => {
    const id = useId(idProp);

    const doBlur = useFocusActions((actions) => actions.blur);

    const doFocus = useFocusActions((actions) => actions.focus);

    const doIsFocused = useFocusActions((actions) => actions.isFocused);

    const isFocused = doIsFocused(id);
    const focused = isFocused || isFocusedProp || false;

    useOnValueChange(focused, () => {
      if (focused) {
        onFocus?.();
      } else {
        onBlur?.();
      }
    });

    const blur = React.useMemo<BlurHandler>(() => {
      return debounce(() => {
        doBlur(id);
      }, blurDebounceWait);
    }, [blurDebounceWait, doBlur, id]);

    const focus = React.useCallback(() => {
      blur.cancel();
      doFocus(id);
    }, [doFocus, id, blur]);

    // pressed
    const [isPressed, setIsPressed] = React.useState(
      defaultState.pressed || false
    );
    const pressed = isPressed || isPressedProp || false;

    useOnValueChange(pressed, () => {
      if (!pressed) {
        onPress?.();
      }
    });

    const pressIn = React.useCallback(() => {
      setIsPressed(true);
    }, []);

    const pressOut = React.useCallback(() => {
      setIsPressed(false);
    }, []);

    // hovered
    const [isHovered, setIsHovered] = React.useState(
      defaultState.hovered || false
    );
    const hovered = isHovered || isHoveredProp || false;

    useOnValueChange(hovered, () => {
      if (hovered) {
        onHoverOver?.();
      } else {
        setIsPressed(false);
        onHoverOut?.();
      }
    });

    const hoverOver = React.useCallback(() => {
      setIsHovered(true);
    }, []);

    const hoverOut = React.useCallback(() => {
      setIsHovered(false);
    }, []);

    const state: PressableState = {
      focused,
      pressed,
      hovered,
    };

    const whenEnabled = (fn: () => void) => {
      return () => {
        if (!disabled) {
          fn();
        }
      };
    };

    const actions: PressableActions = {
      // focused
      focus: whenEnabled(focus),
      blur: whenEnabled(blur),

      // pressed
      pressIn: whenEnabled(pressIn),
      pressOut: whenEnabled(pressOut),

      // hovered
      hoverOver: whenEnabled(hoverOver),
      hoverOut: whenEnabled(hoverOut),
    };

    const element: PressableElement = { ...actions, ...state };

    useSetRef(ref, element);

    return (
      <PressableState.Provider value={state}>
        <PressableActions.Provider value={actions}>
          {renderPressableChildren({ ...rest, ...element }, children)}
        </PressableActions.Provider>
      </PressableState.Provider>
    );
  }
);

type Pressable = typeof Pressable & {
  Provider: typeof FocusProvider;
  WithFeedback: typeof PressableWithFeedback;
};

(Pressable as Pressable).Provider = FocusProvider;
(Pressable as Pressable).WithFeedback = PressableWithFeedback;

export default Pressable as Pressable;
