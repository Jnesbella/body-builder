import * as React from "react";
import styled from "styled-components";
import { useId } from "../../hooks";
import { log } from "../../utils";
import Layout from "../Layout";

import Portal, { PortalProps } from "../Portal/Portal";
import { full, greedy } from "../styled-components";
import Surface from "../Surface";
import Text from "../Text";
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

const TooltipChildrenGreedy = styled.div.attrs({ greedy: true })`
  ${greedy};
  display: flex;
`;

const TooltipContent = styled.div``;

const TooltipContentFullWidth = styled.div.attrs({ fullWidth: true })`
  ${full};
`;

const TooltipContentGreedy = styled.div.attrs({ greedy: true })`
  ${greedy};
  display: flex;
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

  onHoverOver: () => void;
  onHoverOut: () => void;
}

export type TooltipCallback = (props: TooltipCallbackProps) => React.ReactNode;

export interface TooltipProps {
  id?: string;
  placement?:
    | "top"
    | "bottom"
    | "right"
    | "left"
    | "bottom-end"
    | "bottom-center"
    | "right-center";
  content?: React.ReactNode | TooltipCallback;
  children: React.ReactNode | TooltipCallback;
  topOffset?: PortalProps["top"];
  leftOffset?: PortalProps["left"];
  renderChildren?: (props: React.HTMLProps<HTMLDivElement>) => JSX.Element;
  renderContent?: (props: React.HTMLProps<HTMLDivElement>) => JSX.Element;
  onShow?: () => void;
  onHide?: () => void;
  visiblity?: "hidden" | "visible";
}

const Tooltip = React.forwardRef<TooltipElement, TooltipProps>(
  (
    {
      children,
      content,
      id: idProp,
      placement: placement = "bottom",
      topOffset = 0,
      leftOffset = 0,
      renderChildren: Children = TooltipChildren,
      renderContent: Content = TooltipContent,
      onShow,
      onHide,
      visiblity = "visible",
    },
    ref
  ) => {
    const id = useId(idProp);

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

    const focusedTooltipId = useTooltipState((state) => state.focusedTooltipId);

    const isFocused = id ? isTooltipFocused(id) : true;

    const isVisible = isFocused && visiblity === "visible";

    const isVisibleCache = React.useRef(isVisible);

    const isVisibleChanged = isVisible !== isVisibleCache.current;

    React.useEffect(
      function cacheIsVisible() {
        isVisibleCache.current = isVisible;
      },
      [isVisible]
    );

    React.useEffect(
      function handleChangeVisibility() {
        if (isVisibleChanged) {
          if (isVisible) {
            onShow?.();
          } else {
            onHide?.();
          }
        }
      },
      [isVisible, isVisibleChanged, onHide, onShow]
    );

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

          if (["bottom-center"].includes(placement)) {
            left += -(
              (layoutElement.offsetWidth - contentElement.offsetWidth) /
              2
            );
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

        if (contentElement) {
          if (placement.includes("top")) {
            top -= contentElement.offsetHeight;
          }

          if (["right-center"].includes(placement)) {
            top +=
              (layoutElement.offsetHeight - contentElement.offsetHeight) / 2;
          }
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
            onHoverOver: show,
            onHoverOut: hide,
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
          {isVisible && (
            <Content ref={setContentElement}>
              {renderTooltipCallback(content)}
            </Content>
          )}
        </Portal>
      </React.Fragment>
    );
  }
);

interface TooltipTextProps {
  children: React.ReactNode;
}

function TooltipText({ children }: TooltipTextProps) {
  return (
    <Surface elevation={1}>
      <Layout.Box spacingSize={[1, 0.5]}>
        <Text.Label>{children}</Text.Label>
      </Layout.Box>
    </Surface>
  );
}

type Tooltip = typeof Tooltip & {
  Provider: typeof TooltipProvider;
  Children: typeof TooltipChildren;
  ChildrenFullWidth: typeof TooltipChildrenFullWidth;
  Content: typeof TooltipContent;
  ContentFullWidth: typeof TooltipContent;
  Text: typeof TooltipText;
  ChildrenGreedy: typeof TooltipChildrenGreedy;
  ContentGreedy: typeof TooltipContentGreedy;
};

(Tooltip as Tooltip).Provider = TooltipProvider;
(Tooltip as Tooltip).Children = TooltipChildren;
(Tooltip as Tooltip).ChildrenFullWidth = TooltipChildrenFullWidth;
(Tooltip as Tooltip).Content = TooltipContent;
(Tooltip as Tooltip).ContentFullWidth = TooltipContentFullWidth;
(Tooltip as Tooltip).Text = TooltipText;
(Tooltip as Tooltip).ChildrenGreedy = TooltipChildrenGreedy;
(Tooltip as Tooltip).ContentGreedy = TooltipChildrenGreedy;

export default Tooltip as Tooltip;
