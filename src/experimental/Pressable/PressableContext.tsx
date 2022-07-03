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
  state?: PressableState;
  isFocused?: boolean;
}

export function PressableProvider({
  children,
  state: stateProp = DEFAULT_STATE,
  isFocused: isFocusedProp,
}: PressableProviderProps) {
  const [isFocused, setIsFocused] = React.useState(isFocusedProp);

  const focus = React.useCallback(() => {
    setIsFocused(true);
  }, []);

  const blur = React.useCallback(() => {
    setIsFocused(false);
  }, []);

  const state: PressableState = {
    ...stateProp,
    focused: stateProp.focused || isFocused || isFocusedProp,
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
