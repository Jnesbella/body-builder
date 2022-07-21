import { isNil } from "lodash";
import * as React from "react";
import ReactDOM from "react-dom";
import { LayoutChangeEvent, LayoutRectangle, View } from "react-native";
import styled from "styled-components";

import Portal from "../Portal";
import TooltipProvider from "./TooltipProvider";

export interface TooltipProps {
  id?: string;
  content?: React.ReactNode;
  children:
    | React.ReactNode
    | ((props: {
        onLayout: ((event: LayoutChangeEvent) => void) | undefined;
        onFocus: () => void;
        onBlur: () => void;
        focused: boolean;
      }) => React.ReactNode);
}

function Tooltip({ children, content }: TooltipProps) {
  const [layout, setLayout] = React.useState<LayoutRectangle>();

  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  const onLayout = React.useCallback(
    (event: LayoutChangeEvent) => setLayout(event.nativeEvent.layout),
    []
  );

  const onFocus = React.useCallback(() => setIsFocused(true), []);

  const onBlur = React.useCallback(() => setIsFocused(false), []);

  if (layout) {
    console.log("Tooltip: ", { layout });
  }

  return (
    <React.Fragment>
      {typeof children === "function"
        ? children({ onLayout, onFocus, onBlur, focused: isFocused })
        : children}

      <Portal layout={layout}>{isFocused && content}</Portal>
    </React.Fragment>
  );
}

Tooltip.Provider = TooltipProvider;

export default Tooltip;
