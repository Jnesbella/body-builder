import * as React from "react";
import { Layout, setRef } from "@jnesbella/body-builder";
import styled from "styled-components/native";
import { LayoutRectangle } from "react-native";

const MeasureContainer = styled(Layout.Box)``;

export interface MeasureElement {
  layout?: LayoutRectangle;
}

export interface MeasureProps {
  children?: React.ReactNode;
}

const Measure = React.forwardRef<MeasureElement, MeasureProps>(
  ({ children }, ref) => {
    const [layout, setLayout] = React.useState<LayoutRectangle>();

    const element: MeasureElement = {
      layout,
    };

    React.useEffect(function handleRef() {
      setRef(ref, element);
    });

    return (
      <MeasureContainer
        onLayout={(event) => setLayout(event.nativeEvent.layout)}
      >
        {children}
      </MeasureContainer>
    );
  }
);

export default Measure;
