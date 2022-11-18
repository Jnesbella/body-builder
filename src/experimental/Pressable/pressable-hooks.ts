import * as React from "react";
import { PressableElement } from "./pressable-types";

import { PressableActions } from "./PressableActions";
import { PressableState } from "./PressableState";

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

export function usePressableElement(): PressableElement {
  const state = usePressableState((state) => state);
  const actions = usePressableActions((actions) => actions);

  return {
    ...state,
    ...actions,
  };
}
