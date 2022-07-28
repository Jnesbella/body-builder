import { isNil } from "lodash";
import * as React from "react";
import ReactDOM from "react-dom";
import { LayoutChangeEvent, LayoutRectangle, View } from "react-native";
import styled from "styled-components";
import { theme } from "../../styles";

import Portal from "../Portal";
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
}

export type TooltipCallback = (props: TooltipCallbackProps) => React.ReactNode;

export interface TooltipProps {
  id?: string;
  placement?: "top" | "bottom" | "right"; // | "left" ;
  content?: React.ReactNode | TooltipCallback;
  children: React.ReactNode | TooltipCallback;
}

function Tooltip({
  children,
  content,
  id,
  placement: placement = "bottom",
}: TooltipProps) {
  const [layout, setLayout] = React.useState<LayoutRectangle>();

  const focusTooltip = useTooltipActions((actions) => actions.focusTooltip);

  const toggleTooltip = useTooltipActions((actions) => actions.toggleTooltip);

  const blurTooltip = useTooltipActions((actions) => actions.blurTooltip);

  const isTooltipFocused = useTooltipActions(
    (actions) => actions.isTooltipFocused
  );

  const isFocused = id ? isTooltipFocused(id) : false;

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

  // if (layout) {
  //   console.log("Tooltip: ", { layout });
  // }

  const horizontalOffset = React.useMemo(() => {
    return 0;
  }, []);

  const verticalOffset = React.useMemo(() => {
    switch (placement) {
      case "right":
        return;

      case "top":
        return -theme.spacing * 7;

      default:
        return 0;
    }
  }, []);

  const renderTooltipCallback = (
    children?: React.ReactNode | TooltipCallback
  ) =>
    typeof children === "function"
      ? children({ onLayout, onFocus, onBlur, onPress, focused: isFocused })
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
