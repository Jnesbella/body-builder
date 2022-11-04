import * as React from "react";
import { LayoutRectangle } from "react-native";

import Layout from "./Layout";
import { Greedy } from "./styled-components";

export interface MeasureProps extends Greedy {
  children?:
    | React.ReactNode
    | ((rect: LayoutRectangle | undefined) => React.ReactNode);
}

function Measure({ children, ...rest }: MeasureProps) {
  const [rect, setRect] = React.useState<LayoutRectangle>();

  return (
    <Layout.Box
      {...rest}
      onLayout={(event) => {
        setRect(event.nativeEvent.layout);
      }}
    >
      {children && typeof children === "function" ? children(rect) : children}
    </Layout.Box>
  );
}

export default Measure;
