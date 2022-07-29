import * as React from "react";
import { debounce, noop } from "lodash";

import { PressableState as DefaultPressableState } from "../../components/componentsTypes";
import { log } from "../../utils";

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
  name?: string;

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
}

const PressableProvider = React.forwardRef<
  PressableProviderElement,
  PressableProviderProps
>(
  (
    {
      name,
      children,
      defaultState = DEFAULT_STATE,

      onBlur,
      onFocus,
      blurDebounceWait = 100,

      onPress,
      // onPressCapture,
      // onLongPress,

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
    const focused = isFocused || isFocusedProp || false;

    const isFocusedRef = React.useRef(focused);

    const isFocusChanged = focused !== isFocusedRef.current;

    React.useEffect(
      function cacheIsFocused() {
        isFocusedRef.current = focused;
      },
      [focused]
    );

    React.useEffect(
      function handleFocusChange() {
        if (isFocusChanged) {
          if (focused) {
            // log(`${name} onFocus`);
            onFocus?.();
          } else {
            // log(`${name} onBlur`);
            onBlur?.();
          }
        }
      },
      [isFocusChanged, focused, onBlur, onFocus]
    );

    const blur = React.useMemo<BlurHandler>(() => {
      return debounce(() => {
        // log(`${name} blur`);
        setIsFocused(false);
      }, blurDebounceWait);
    }, [blurDebounceWait]);

    // const blur = React.useCallback(() => {
    //   log(`${name} blur`);
    //   setIsFocused(false);
    // }, [name]);

    const focus = React.useCallback(() => {
      // log(`${name} focus`);
      blur.cancel();
      setIsFocused(true);
    }, [name, blur]);

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
      function handlePressChange() {
        if (isPressedChanged && pressed) {
          log(`${name} onPress`);
          onPress?.();
        }
      },
      [isPressedChanged, pressed, onPress]
    );

    const pressIn = React.useCallback(() => {
      // log(`${name} pressIn`);
      setIsPressed(true);
    }, [name]);

    const pressOut = React.useCallback(() => {
      // log(`${name} pressOut`);
      setIsPressed(false);
    }, [name]);

    // hovered
    const [isHovered, setIsHovered] = React.useState(
      defaultState.hovered || false
    );
    const hovered = isHovered || isHoveredProp || false;

    const hoverOver = React.useCallback(() => {
      // log(`${name} hoverOver`);
      setIsHovered(true);
    }, [name]);

    const hoverOut = React.useCallback(() => {
      // log(`${name} hoverOut`);
      setIsHovered(false);
    }, [name]);

    const state: PressableState = {
      focused,
      pressed,
      hovered,
    };

    // if (name === "SlateEditor") {
    //   log(`${name} state`, state);
    // }

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
