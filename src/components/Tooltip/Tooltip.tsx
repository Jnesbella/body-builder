import { isNil, get } from "lodash";
import * as React from "react";
import ReactDOM from "react-dom";
import { LayoutChangeEvent, LayoutRectangle, View } from "react-native";
import styled from "styled-components";
import { theme } from "../../styles";
import { log } from "../../utils";

import Portal, { PortalProps } from "../Portal/Portal";
import { full } from "../styled-components";
import TooltipProvider, {
  useTooltipActions,
  useTooltipState,
} from "./TooltipProvider";

interface TooltipState {
  focused: boolean;
}

const TooltipChildren = styled.div``;

const TooltipChildrenFullWidth = styled.div.attrs({ fullWidth: true })`
  ${full};
`;

const TooltipContent = styled.div``;

const TooltipContentFullWidth = styled.div.attrs({ fullWidth: true })`
  ${full};
`;

interface TooltipActions {
  toggleVisibility: () => void;
  show: () => void;
  hide: () => void;
}

export interface TooltipElement extends TooltipActions, TooltipState {}

export interface TooltipCallbackProps extends TooltipElement {
  onFocus: () => void;
  onBlur: () => void;
  onPress: () => void;
}

export type TooltipCallback = (props: TooltipCallbackProps) => React.ReactNode;

export interface TooltipProps {
  id?: string;
  placement?: "top" | "bottom" | "right" | "left" | "bottom-end";
  content?: React.ReactNode | TooltipCallback;
  children: React.ReactNode | TooltipCallback;
  topOffset?: PortalProps["top"];
  leftOffset?: PortalProps["left"];
  renderChildren?: (props: React.HTMLProps<HTMLDivElement>) => JSX.Element;
  renderContent?: (props: React.HTMLProps<HTMLDivElement>) => JSX.Element;
}

const Tooltip = React.forwardRef<TooltipElement, TooltipProps>(
  (
    {
      children,
      content,
      id,
      placement: placement = "bottom",
      topOffset = 0,
      leftOffset = 0,
      renderChildren: Children = TooltipChildren,
      renderContent: Content = TooltipContent,
    },
    ref
  ) => {
    const [layoutElement, setLayoutElement] =
      React.useState<HTMLDivElement | null>(null);

    const [contentElement, setContentElement] =
      React.useState<HTMLDivElement | null>(null);

    const focusTooltip = useTooltipActions((actions) => actions.focusTooltip);

    const toggleTooltip = useTooltipActions((actions) => actions.toggleTooltip);

    const blurTooltip = useTooltipActions((actions) => actions.blurTooltip);

    const getTopOffset = useTooltipActions((actions) => actions.getTopOffset);

    const getLeftOffset = useTooltipActions((actions) => actions.getLeftOffset);

    const isTooltipFocused = useTooltipActions(
      (actions) => actions.isTooltipFocused
    );

    const isFocused = id ? isTooltipFocused(id) : true;

    const toggleVisibility = React.useCallback(
      () => toggleTooltip(id),
      [toggleTooltip, id]
    );

    const show = React.useCallback(() => focusTooltip(id), [focusTooltip, id]);

    const hide = React.useCallback(() => blurTooltip(id), [blurTooltip, id]);

    const positionCache = React.useRef<
      { left?: number; top?: number } | undefined
    >();

    const getHorizontalOffset = () => {
      if (layoutElement) {
        let left = 0; // layoutElement.offsetLeft;
        left += leftOffset;
        left += getLeftOffset(layoutElement);

        if (placement.includes("right")) {
          left += layoutElement.offsetWidth;
        }

        if (contentElement) {
          if (placement.includes("left")) {
            left += -contentElement.offsetWidth;
          }

          if (placement.includes("end")) {
            left += -(contentElement.offsetWidth - layoutElement.offsetWidth);
          }
        }

        return left;
      }
    };

    const getVerticalOffset = () => {
      if (layoutElement) {
        let top = 0; // layoutElement.offsetTop;
        top += topOffset;
        top += getTopOffset(layoutElement);

        if (placement.includes("bottom")) {
          top += layoutElement.offsetHeight;
        }

        return top;
      }
    };

    const top = getVerticalOffset();
    const left = getHorizontalOffset();

    React.useEffect(function calculateTooltipPosition() {
      positionCache.current = {
        left,
        top,
      };
    });

    const element: TooltipElement = {
      focused: isFocused,
      toggleVisibility,
      show,
      hide,
    };

    React.useEffect(function handleRef() {
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    });

    const renderTooltipCallback = (
      children?: React.ReactNode | TooltipCallback
    ) =>
      typeof children === "function"
        ? children({
            ...element,
            onFocus: show,
            onBlur: hide,
            onPress: toggleVisibility,
          })
        : children;

    return (
      <React.Fragment>
        <Children ref={setLayoutElement}>
          {renderTooltipCallback(children)}
        </Children>

        <Portal
          left={left || positionCache.current?.left}
          top={top || positionCache.current?.top}
        >
          {isFocused && (
            <Content ref={setContentElement}>
              {renderTooltipCallback(content)}
            </Content>
          )}
        </Portal>
      </React.Fragment>
    );
  }
);

type Tooltip = typeof Tooltip & {
  Provider: typeof TooltipProvider;
  Children: typeof TooltipChildren;
  ChildrenFullWidth: typeof TooltipChildrenFullWidth;
  Content: typeof TooltipContent;
  ContentFullWidth: typeof TooltipContent;
};

(Tooltip as Tooltip).Provider = TooltipProvider;
(Tooltip as Tooltip).Children = TooltipChildren;
(Tooltip as Tooltip).ChildrenFullWidth = TooltipChildrenFullWidth;
(Tooltip as Tooltip).Content = TooltipContent;
(Tooltip as Tooltip).ContentFullWidth = TooltipContentFullWidth;

export default Tooltip as Tooltip;
