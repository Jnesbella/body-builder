import * as React from "react";
import { log } from "../../utils";

import Portal, { PortalProviderProps } from "../Portal";

import { TooltipProps } from "./Tooltip";

export interface TooltipState {
  focusedTooltipId: TooltipProps["id"];
}

export interface TooltipActions {
  focusTooltip: (id: TooltipProps["id"]) => void;
  blurTooltip: () => void;
  toggleTooltip: (id: TooltipProps["id"]) => void;
  isTooltipFocused: (id: TooltipProps["id"]) => boolean;
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

  log("TooltipProvider: ", state);

  const focusTooltip = React.useCallback(
    (id: TooltipProps["id"]) => {
      log("focusTooltip: ", id);
      if (focusedTooltipId !== id) {
        setFocusedTooltipId(id);
      }
    },
    [focusedTooltipId]
  );

  const blurTooltip = React.useCallback(() => {
    log("blurTooltip");
    if (!!focusedTooltipId) {
      setFocusedTooltipId(undefined);
    }
  }, [focusedTooltipId]);

  const isTooltipFocused = React.useCallback(
    (id: TooltipProps["id"]) => focusedTooltipId === id,
    [focusedTooltipId]
  );

  const toggleTooltip = React.useCallback((id: TooltipProps["id"]) => {
    log("toggleTooltip: ", id);
    setFocusedTooltipId((prevFocusedTooltipId) =>
      prevFocusedTooltipId === id ? undefined : id
    );
  }, []);

  const actions = {
    focusTooltip,
    blurTooltip,
    isTooltipFocused,
    toggleTooltip,
  };

  return (
    <Portal.Provider {...rest}>
      <TooltipActions.Provider value={actions}>
        <TooltipState.Provider value={state}>{children}</TooltipState.Provider>
      </TooltipActions.Provider>
    </Portal.Provider>
  );
}

export default TooltipProvider;
