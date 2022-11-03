import * as React from "react";
import { useSetRef } from "../../hooks";

export interface GrowElement {
  growTo: (toValue?: number) => void;
  shink: () => void;
}

export interface GrowProps {}

const Grow = React.forwardRef<GrowElement, GrowProps>(({}, ref) => {
  const growTo = (toValue: number) => {};

  const shink = () => growTo(0);

  useSetRef(ref, { growTo, shink });

  return <React.Fragment />;
});

export default Grow;
