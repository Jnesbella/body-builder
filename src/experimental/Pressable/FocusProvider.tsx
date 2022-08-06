import { isUndefined } from "lodash";
import * as React from "react";

export interface FocusState {
  focusedId?: string;
}

export const FocusState = React.createContext<FocusState | null>(null);

export function useFocusState<Output>(selector: (state: FocusState) => Output) {
  const state = React.useContext(FocusState);

  if (state === null) {
    throw new Error("useFocusState must be used within a FocusProvider");
  }

  return selector(state);
}

export interface FocusActions {
  focus: (id: string) => void;
  blur: (id?: string) => void;
  isFocused: (id: string) => boolean;
}

export const FocusActions = React.createContext<FocusActions | null>(null);

export function useFocusActions<Output>(
  selector: (actions: FocusActions) => Output
) {
  const actions = React.useContext(FocusActions);

  if (actions === null) {
    throw new Error("useFocusActions must be used within a Pressable");
  }

  return selector(actions);
}

export interface FocusProviderProps {
  children: React.ReactNode;
}

function FocusProvider({ children }: FocusProviderProps) {
  const [focusedId, setFocusedId] = React.useState<string>();

  const focus = React.useCallback((id: string) => {
    setFocusedId(id);
  }, []);

  const blur = React.useCallback((id?: string) => {
    setFocusedId((prevId) =>
      prevId === id || isUndefined(id) ? undefined : prevId
    );
  }, []);

  const isFocused = React.useCallback(
    (id: string) => {
      return focusedId === id;
    },
    [focusedId]
  );

  const state: FocusState = {
    focusedId,
  };

  const actions: FocusActions = {
    focus,
    blur,
    isFocused,
  };

  return (
    <FocusState.Provider value={state}>
      <FocusActions.Provider value={actions}>{children}</FocusActions.Provider>
    </FocusState.Provider>
  );
}

export default FocusProvider;
