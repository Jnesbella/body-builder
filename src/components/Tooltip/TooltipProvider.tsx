import * as React from "react";
import { log, setRef } from "../../utils";

import Portal, { PortalProviderProps } from "../Portal";

import { TooltipProps } from "./Tooltip";

export interface TooltipState {
  focusedTooltipId: TooltipProps["id"];
}

export interface TooltipActions {
  focusTooltip: (id: TooltipProps["id"]) => void;
  blurTooltip: (id: TooltipProps["id"]) => void;
  toggleTooltip: (id: TooltipProps["id"]) => void;
  isTooltipFocused: (id: TooltipProps["id"]) => boolean;
  getTopOffset: (node: HTMLDivElement) => number;
  getLeftOffset: (node: HTMLDivElement) => number;
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

export type TooltipProviderElement = HTMLDivElement;

export interface TooltipProviderProps extends PortalProviderProps {}

const TooltipProvider = React.forwardRef<
  TooltipProviderElement,
  TooltipProviderProps
>(({ children, ...rest }, ref) => {
  const [focusedTooltipId, setFocusedTooltipId] = React.useState<string>();

  const state: TooltipState = { focusedTooltipId };

  const focusTooltip = React.useCallback((id: TooltipProps["id"]) => {
    log("focusTooltip", { id });
    setFocusedTooltipId(id);
  }, []);

  const blurTooltip = React.useCallback((id: TooltipProps["id"]) => {
    log("blurTooltip", { id });
    setFocusedTooltipId((prevFocusedTooltipId) =>
      prevFocusedTooltipId === id ? undefined : prevFocusedTooltipId
    );
  }, []);

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

  const innerRef = React.useRef<HTMLDivElement>(null);

  const getTopOffset = React.useCallback((node: HTMLDivElement) => {
    const { current: portalContainer } = innerRef;
    const top = portalContainer
      ? getOffsetBetweenNodes(node, portalContainer).top
      : 0;

    return top;
  }, []);

  const getLeftOffset = React.useCallback((node: HTMLDivElement) => {
    const { current: portalContainer } = innerRef;
    const left = portalContainer
      ? getOffsetBetweenNodes(node, portalContainer).left
      : 0;

    return left;
  }, []);

  const actions = {
    focusTooltip,
    blurTooltip,
    isTooltipFocused,
    toggleTooltip,
    getTopOffset,
    getLeftOffset,
  };

  return (
    <Portal.Provider
      {...rest}
      ref={(node) => {
        setRef(ref, node);
        setRef(innerRef, node);
      }}
    >
      <TooltipActions.Provider value={actions}>
        <TooltipState.Provider value={state}>{children}</TooltipState.Provider>
      </TooltipActions.Provider>
    </Portal.Provider>
  );
});

const getElementAttr = (element: Element, attr: keyof HTMLElement) => {
  if (attr in element) {
    return (element as HTMLElement)[attr];
  }

  return null;
};

const getOffsetParent = (element: Element) =>
  getElementAttr(element, "offsetParent") as Element | null;

const getOffsetValue = (element: Element, attr: "offsetLeft" | "offsetTop") =>
  getElementAttr(element, attr) as number | null;

const getOffsetBetweenNodes = (n: Element, p: Element) => {
  let node: Element | null = n;
  let parent = getOffsetParent(node);

  const isParentFound = () => parent === p;

  const next = () => {
    node = parent;
    parent = node ? getOffsetParent(node) : null;
  };

  let left = 0;
  let top = 0;

  do {
    left += getOffsetValue(node, "offsetLeft") || 0;
    top += getOffsetValue(node, "offsetTop") || 0;

    if (isParentFound()) {
      break;
    }

    next();
  } while (node && parent);

  const parentFound = isParentFound();

  return { left: parentFound ? left : 0, top: parentFound ? top : 0 };
};

export default TooltipProvider;
