import * as React from "react";
import { debounce, noop } from "lodash";
import { NativeSyntheticEvent, NativeScrollEvent } from "react-native";

import { useSetRef } from "../../hooks";

export interface ScrollViewState extends Partial<NativeScrollEvent> {}

export const ScrollViewState = React.createContext<ScrollViewState | null>(
  null
);

export interface ScrollViewActions {}

export const ScrollViewActions = React.createContext<ScrollViewActions | null>(
  null
);

export function useScrollViewState<Output>(
  selector: (state: ScrollViewState) => Output
) {
  const state = React.useContext(ScrollViewState);

  if (state === null) {
    throw new Error("useScrollViewState must be used within a ScrollView");
  }

  return selector(state);
}

export function useScrollViewActions<Output>(
  selector: (actions: ScrollViewActions) => Output
) {
  const actions = React.useContext(ScrollViewActions);

  if (actions === null) {
    throw new Error("useScrollViewActions must be used within a ScrollView");
  }

  return selector(actions);
}

export interface ScrollViewProviderElement
  extends ScrollViewActions,
    ScrollViewState {}

export interface ScrollViewProviderProps {
  children?: React.ReactNode;
  state?: ScrollViewState;
}

const ScrollViewProvider = React.forwardRef<
  ScrollViewProviderElement,
  ScrollViewProviderProps
>(({ children, state: stateProp }, ref) => {
  const state: ScrollViewState = {
    ...stateProp,
  };

  const actions: ScrollViewActions = {};

  const element: ScrollViewProviderElement = { ...actions, ...state };

  useSetRef(ref, element);

  return (
    <ScrollViewState.Provider value={state}>
      <ScrollViewActions.Provider value={actions}>
        {children}
      </ScrollViewActions.Provider>
    </ScrollViewState.Provider>
  );
});

export default ScrollViewProvider;
