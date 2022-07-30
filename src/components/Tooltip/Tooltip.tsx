import { isNil, get } from "lodash";
import * as React from "react";
import ReactDOM from "react-dom";
import { LayoutChangeEvent, LayoutRectangle, View } from "react-native";
import styled from "styled-components";
import { theme } from "../../styles";
import { log } from "../../utils";

import Portal, { PortalProps } from "../Portal";
import TooltipProvider, {
  useTooltipActions,
  useTooltipState,
} from "./TooltipProvider";

export interface TooltipCallbackProps {
  onLayout: ((event: LayoutChangeEvent) => void) | undefined;
  onFocus: () => void;
  onBlur: () => void;
  onPress: () => void;
  focused: boolean;
  layoutRef: React.MutableRefObject<HTMLDivElement | null>;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
}

export type TooltipCallback = (props: TooltipCallbackProps) => React.ReactNode;

export interface TooltipProps {
  id?: string;
  placement?: "top" | "bottom" | "right" | "left" | "bottom-end";
  content?: React.ReactNode | TooltipCallback;
  children: React.ReactNode | TooltipCallback;
  verticalOffset?: PortalProps["verticalOffset"];
  horizontalOffset?: PortalProps["horizontalOffset"];
}

function Tooltip({
  children,
  content,
  id,
  placement: placement = "bottom",
  verticalOffset: verticalOffsetProp = 0,
  horizontalOffset: horizontalOffsetProp = 0,
}: TooltipProps) {
  const layoutRef = React.useRef<HTMLDivElement>(null);

  const contentRef = React.useRef<HTMLDivElement>(null);

  const [layout, setLayout] = React.useState<LayoutRectangle>();

  const focusTooltip = useTooltipActions((actions) => actions.focusTooltip);

  const toggleTooltip = useTooltipActions((actions) => actions.toggleTooltip);

  const blurTooltip = useTooltipActions((actions) => actions.blurTooltip);

  const isTooltipFocused = useTooltipActions(
    (actions) => actions.isTooltipFocused
  );

  const isFocused = id ? isTooltipFocused(id) : true;

  const onLayout = React.useCallback(
    (event: LayoutChangeEvent) => setLayout(event.nativeEvent.layout),
    []
  );

  const onFocus = React.useCallback(() => focusTooltip(id), [focusTooltip, id]);

  const onBlur = React.useCallback(() => blurTooltip(), [blurTooltip]);

  const onPress = React.useCallback(
    () => toggleTooltip(id),
    [toggleTooltip, id]
  );

  const positionCache = React.useRef<
    { left: number; top: number } | undefined
  >();

  const getHorizontalOffset = (
    layoutElement: HTMLDivElement,
    contentElement: HTMLDivElement | null
  ) => {
    let left = layoutElement.offsetLeft;
    left += horizontalOffsetProp;

    if (placement.includes("right")) {
      left += layoutElement.offsetWidth;
    }

    if (placement.includes("end") && contentElement) {
      left += -(contentElement.offsetWidth - layoutElement.offsetWidth);
    }

    return left;
  };

  const getVerticalOffset = (
    layoutElement: HTMLDivElement,
    _contentElement: HTMLDivElement | null
  ) => {
    let top = layoutElement.offsetTop;
    top += verticalOffsetProp;

    if (placement.includes("bottom")) {
      top += layoutElement.offsetHeight;
    }

    return top;
  };

  React.useEffect(function calculateTooltipPosition() {
    const { current: layoutElement } = layoutRef;
    const { current: contentElement } = contentRef;

    if (layoutElement) {
      positionCache.current = {
        left: getHorizontalOffset(layoutElement, contentElement),
        top: getVerticalOffset(layoutElement, contentElement),
      };
    }
  });

  const renderTooltipCallback = (
    children?: React.ReactNode | TooltipCallback
  ) =>
    typeof children === "function"
      ? children({
          onLayout,
          onFocus,
          onBlur,
          onPress,
          focused: isFocused,
          layoutRef,
          contentRef,
        })
      : children;

  return (
    <React.Fragment>
      {renderTooltipCallback(children)}

      <Portal
        layout={layout}
        horizontalOffset={positionCache.current?.left}
        verticalOffset={positionCache.current?.top}
      >
        {isFocused && renderTooltipCallback(content)}
      </Portal>
    </React.Fragment>
  );
}

Tooltip.Provider = TooltipProvider;

export default Tooltip;
