import * as React from "react";
import { debounce, noop } from "lodash";

import { PressableState as DefaultPressableState } from "../../components/componentsTypes";
import { log } from "../../utils";
import { useFocusActions, useFocusState } from "./FocusProvider";

export interface PressableState extends DefaultPressableState {}

export const PressableState = React.createContext<PressableState | null>(null);

export type BlurHandler = (() => void) & { cancel: () => void };

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

export interface PressableProviderProps {
  id: string;

  children?:
    | React.ReactNode
    | ((props: PressableProviderElement) => React.ReactNode);
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
    // focused
    const [isFocused, setIsFocused] = React.useState(
      defaultState.focused || false
    );

    const _blur = useFocusActions((actions) => actions.blur);

    const _focus = useFocusActions((actions) => actions.focus);

    const _isFocused = useFocusActions((actions) => actions.isFocused);
    const focused = _isFocused(id) || isFocusedProp || isFocused || false;

    const isFocusedRef = React.useRef(focused);

    const isFocusChanged = focused !== isFocusedRef.current;

    React.useEffect(
      function cacheIsFocused() {
        isFocusedRef.current = focused;
      },
      [focused]
    );

    React.useEffect(
      function handleFocusedChange() {
        if (isFocusChanged) {
          if (focused) {
            onFocus?.();
          } else {
            onBlur?.();
          }
        }
      },
      [isFocusChanged, focused, onBlur, onFocus]
    );

    const blur = React.useMemo<BlurHandler>(() => {
      return debounce(() => {
        _blur(id);
        setIsFocused(false);
      }, blurDebounceWait);
    }, [blurDebounceWait, _blur, id]);

    const focus = React.useCallback(() => {
      blur.cancel();
      _focus(id);
      setIsFocused(true);
    }, [_focus, id, blur]);

    // pressed
    const [isPressed, setIsPressed] = React.useState(
      defaultState.pressed || false
    );
    const pressed = isPressed || isPressedProp || false;

    const isPressedRef = React.useRef(pressed);

    const isPressedChanged = pressed !== isPressedRef.current;

    React.useEffect(
      function cacheIsPressed() {
        isPressedRef.current = pressed;
      },
      [pressed]
    );

    React.useEffect(
      function handlePressedChange() {
        if (isPressedChanged && !pressed) {
          onPress?.();
        }
      },
      [isPressedChanged, pressed, onPress]
    );

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

    const isHoveredRef = React.useRef(pressed);

    const isHoveredChanged = hovered !== isHoveredRef.current;

    React.useEffect(
      function cacheIsHovered() {
        isHoveredRef.current = hovered;
      },
      [hovered]
    );

    React.useEffect(
      function handleHoveredChange() {
        if (isHoveredChanged) {
          if (hovered) {
            onHoverOver?.();
          } else {
            setIsPressed(false);
            onHoverOut?.();
          }
        }
      },
      [isHoveredChanged, onHoverOut, onHoverOver, onHoverOut]
    );

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

    React.useEffect(function handleRef() {
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    });

    return (
      <PressableState.Provider value={state}>
        <PressableActions.Provider value={actions}>
          {children && typeof children === "function"
            ? (children as unknown as any)(element)
            : children}
        </PressableActions.Provider>
      </PressableState.Provider>
    );
  }
);

export default PressableProvider;
