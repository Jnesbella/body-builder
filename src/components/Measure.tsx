import * as React from "react";
import { LayoutRectangle } from "react-native";
import { useSetRef } from "../hooks";

import Layout from "./Layout";
import { Greedy } from "./styled-components";

export interface MeasureElement {
  rect?: LayoutRectangle;
}

type ChildrenRenderer = (props: MeasureElement) => JSX.Element;

export interface MeasureProps extends Greedy {
  children?: React.ReactNode | ChildrenRenderer;
}

const Measure = React.forwardRef<MeasureElement, MeasureProps>(
  ({ children, ...rest }, ref) => {
    const [rect, setRect] = React.useState<LayoutRectangle>();

    const element: MeasureElement = {
      rect,
    };

    useSetRef(ref, element);

    return (
      <Layout.Box
        {...rest}
        onLayout={(event) => {
          setRect(event.nativeEvent.layout);
        }}
      >
        {children && typeof children === "function"
          ? (children as ChildrenRenderer)(element)
          : children}
      </Layout.Box>
    );
  }
);

export default Measure;
