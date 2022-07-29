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
}

export type TooltipCallback = (props: TooltipCallbackProps) => React.ReactNode;

export interface TooltipProps {
  id?: string;
  placement?: "top" | "bottom" | "right" | "left";
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

  const horizontalOffset = (() => {
    let left = layoutRef.current?.offsetLeft || get(layout, "left") || 0;
    left += horizontalOffsetProp;

    switch (placement) {
      case "right":
        left += layoutRef.current?.offsetWidth || get(layout, "width") || 0;
        break;
    }

    return left;
  })();

  const verticalOffset = (() => {
    let top = layoutRef.current?.offsetTop || get(layout, "top") || 0;
    top += verticalOffsetProp;

    switch (placement) {
      case "bottom":
        top += layoutRef.current?.offsetHeight || get(layout, "height") || 0;
        break;
    }

    return top;
  })();

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
        })
      : children;

  return (
    <React.Fragment>
      {renderTooltipCallback(children)}

      <Portal
        layout={layout}
        horizontalOffset={horizontalOffset}
        verticalOffset={verticalOffset}
      >
        {isFocused && renderTooltipCallback(content)}
      </Portal>
    </React.Fragment>
  );
}

Tooltip.Provider = TooltipProvider;

export default Tooltip;
