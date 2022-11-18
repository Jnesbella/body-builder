import * as React from "react";

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
