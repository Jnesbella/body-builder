import * as React from "react";
import { debounce, DebouncedFunc } from "lodash";

import { PressableState as DefaultPressableState } from "../../components/componentsTypes";
import { log } from "../../utils";
import { useOnValueChange, useSetRef } from "../../hooks";

import { useFocusActions, useFocusState } from "./FocusProvider";

export interface PressableState extends DefaultPressableState {}

export const PressableState = React.createContext<PressableState | null>(null);

// export type BlurHandler = (() => void) & { cancel: () => void };
export type BlurHandler = DebouncedFunc<() => void>;

export interface PressableActions {
  focus: () => void;
  blur: () => void;

  pressIn: () => void;
  pressOut: () => void;

  hoverOver: () => void;
  hoverOut: () => void;
}

export const PressableActions = React.createContext<PressableActions | null>(
  null
);

export function usePressableState<Output>(
  selector: (state: PressableState) => Output
) {
  const state = React.useContext(PressableState);

  if (state === null) {
    throw new Error("usePressableState must be used within a Pressable");
  }

  return selector(state);
}

export function usePressableActions<Output>(
  selector: (actions: PressableActions) => Output
) {
  const actions = React.useContext(PressableActions);

  if (actions === null) {
    throw new Error("usePressableActions must be used within a Pressable");
  }

  return selector(actions);
}

const DEFAULT_STATE: PressableState = {
  pressed: false,
};

export interface PressableProviderElement
  extends PressableActions,
    PressableState {}

type PressableProviderRenderChildrenCallback = (
  props: PressableProviderElement
) => React.ReactNode;

export interface PressableProviderProps {
  id: string;

  children?: React.ReactNode | PressableProviderRenderChildrenCallback;
  defaultState?: Partial<PressableState>;

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

const PressableProvider = React.forwardRef<
  PressableProviderElement,
  PressableProviderProps
>(
  (
    {
      id,
      children,
      defaultState = DEFAULT_STATE,

      onBlur,
      onFocus,
      blurDebounceWait = 100,

      onPress,
      // onPressCapture,
      // onLongPress,

      onHoverOver,
      onHoverOut,

      isFocused: isFocusedProp,
      isPressed: isPressedProp,
      isHovered: isHoveredProp,
    },
    ref
  ) => {
    const _blur = useFocusActions((actions) => actions.blur);

    const _focus = useFocusActions((actions) => actions.focus);

    const _isFocused = useFocusActions((actions) => actions.isFocused);

    const isFocused = _isFocused(id);
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
        _blur(id);
      }, blurDebounceWait);
    }, [blurDebounceWait, _blur, id]);

    const focus = React.useCallback(() => {
      blur.cancel();
      _focus(id);
    }, [_focus, id, blur]);

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

    const actions: PressableActions = {
      // focused
      focus,
      blur,

      // pressed
      pressIn,
      pressOut,

      // hovered
      hoverOver,
      hoverOut,
    };

    const element: PressableProviderElement = { ...actions, ...state };

    useSetRef(ref, element);

    const renderChildren = () => {
      return typeof children === "function"
        ? (children as PressableProviderRenderChildrenCallback)(element)
        : children;
    };

    return (
      <PressableState.Provider value={state}>
        <PressableActions.Provider value={actions}>
          {renderChildren()}
        </PressableActions.Provider>
      </PressableState.Provider>
    );
  }
);

export default PressableProvider;
