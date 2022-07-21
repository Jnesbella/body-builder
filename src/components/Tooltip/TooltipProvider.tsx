import * as React from "react";

import Portal, { PortalProviderProps } from "../Portal";

import { TooltipProps } from "./Tooltip";

export interface TooltipState {
  focusedTooltipId: TooltipProps["id"];
}

export interface TooltipActions {
  focusTooltip: (id: TooltipProps["id"]) => void;
  blurTooltip: () => void;
  isTooltipFocused: (id: TooltipProps["id"]) => void;
}

export const TooltipState = React.createContext<TooltipState | null>(null);

export const TooltipActions = React.createContext<TooltipActions | null>(null);

export function useTooltipState<Output>(
  selector: (state: TooltipState) => Output
) {
  const state = React.useContext(TooltipState);

  if (state === null) {
    throw new Error("useTooltipState must be used within a TooltipProvider");
  }

  return selector(state);
}

export function useTooltipActions<Output>(
  selector: (state: TooltipActions) => Output
) {
  const state = React.useContext(TooltipActions);

  if (state === null) {
    throw new Error("useTooltipActions must be used within a TooltipProvider");
  }

  return selector(state);
}

export interface TooltipProviderProps extends PortalProviderProps {}

function TooltipProvider({ children, ...rest }: TooltipProviderProps) {
  const [focusedTooltipId, setFocusedTooltipId] = React.useState<string>();

  const state: TooltipState = { focusedTooltipId };

  const focusTooltip = React.useCallback((string: TooltipProps["id"]) => {
    setFocusedTooltipId(string);
  }, []);

  const blurTooltip = React.useCallback(() => {
    setFocusedTooltipId(undefined);
  }, []);

  const isTooltipFocused = React.useCallback(
    (string: TooltipProps["id"]) => {
      return focusedTooltipId === string;
    },
    [focusedTooltipId]
  );

  const actions = { focusTooltip, blurTooltip, isTooltipFocused };

  return (
    <Portal.Provider {...rest}>
      <TooltipActions.Provider value={actions}>
        <TooltipState.Provider value={state}>{children}</TooltipState.Provider>
      </TooltipActions.Provider>
    </Portal.Provider>
  );
}

export default TooltipProvider;
