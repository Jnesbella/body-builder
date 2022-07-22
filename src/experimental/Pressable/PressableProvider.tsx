import * as React from "react";

import { PressableState as DefaultPressableState } from "../../components/componentsTypes";

export interface PressableState extends DefaultPressableState {}

export const PressableState = React.createContext<PressableState | null>(null);

export interface PressableActions {
  focus: () => void;
  blur: () => void;
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

export interface PressableProviderProps {
  children?:
    | React.ReactNode
    | ((props: PressableState & PressableActions) => React.ReactNode);
  defaultState?: PressableState;
  isFocused?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
}

function PressableProvider({
  children,
  defaultState = DEFAULT_STATE,
  onBlur,
  onFocus,
}: PressableProviderProps) {
  const [_isFocused, setIsFocused] = React.useState(
    defaultState.focused || false
  );

  const isFocused = _isFocused || defaultState.focused;

  const isFocusedRef = React.useRef(isFocused);

  const isFocusChanged = isFocused !== isFocusedRef.current;

  React.useEffect(
    function cacheIsFocused() {
      isFocusedRef.current = isFocused;
    },
    [isFocused]
  );

  React.useEffect(
    function handleFocusChange() {
      if (isFocusChanged) {
        if (isFocused) {
          onFocus?.();
        } else {
          onBlur?.();
        }
      }
    },
    [isFocusChanged, isFocused, onBlur, onFocus]
  );

  const focus = React.useCallback(() => {
    setIsFocused(true);
  }, []);

  const blur = React.useCallback(() => {
    setIsFocused(false);
  }, []);

  const state: PressableState = {
    ...defaultState,
    focused: isFocused,
  };

  const actions: PressableActions = {
    focus,
    blur,
  };

  return (
    <PressableState.Provider value={state}>
      <PressableActions.Provider value={actions}>
        {children && typeof children === "function"
          ? children?.({ ...state, ...actions })
          : children}
      </PressableActions.Provider>
    </PressableState.Provider>
  );
}

export default PressableProvider;
