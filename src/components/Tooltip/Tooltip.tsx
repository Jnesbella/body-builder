import { isNil } from "lodash";
import * as React from "react";
import ReactDOM from "react-dom";
import { LayoutRectangle, View } from "react-native";
import styled from "styled-components";

import Portal from "../Portal";

export interface TooltipProps {
  layout?: LayoutRectangle;
  children:
    | React.ReactNode
    | ((props: { Portal: typeof Portal }) => React.ReactNode);
}

function Tooltip({ children, layout }: TooltipProps) {
  return typeof children === "function" ? (
    children({ Portal })
  ) : (
    <Portal layout={layout}>{children}</Portal>
  );
}

export default Tooltip;
