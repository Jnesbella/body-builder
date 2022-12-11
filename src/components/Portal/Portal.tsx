import { isNumber } from "lodash";
import * as React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import { useSetRef } from "../../hooks";
import { log } from "../../utils";

import { zIndex } from "../styled-components";

import PortalProvider, { usePortalState } from "./PortalProvider";

const PortalContainer = styled.div<{
  top: number;
  left: number;
  visible?: boolean;
}>`
  ${zIndex("aboveAll")};

  position: absolute;

  pointer-events: ${(props) => (props.visible ? "auto" : "none")};
  left: ${({ left }) => left}px;
  top: ${({ top }) => top}px;
`;

export type PortalElement = HTMLDivElement;

export interface PortalProps {
  children: React.ReactNode;
  top?: number;
  left?: number;
  zIndex?: number;
  visible?: boolean;
}

export const Portal = React.forwardRef<PortalElement, PortalProps>(
  ({ children, top = 0, left = 0, visible: isVisible }, ref) => {
    const container = usePortalState((state) => state.container);

    // useSetRef(ref, container);

    // React.useEffect(function handleRef() {
    //   if (typeof ref === "function") {
    //     ref(container);
    //   } else if (ref) {
    //     ref.current = container;
    //   }
    // });

    const renderChildren = () => {
      if (!container) {
        return null;
      }

      return ReactDOM.createPortal(
        <PortalContainer ref={ref} top={top} left={left} visible={isVisible}>
          {children}
        </PortalContainer>,
        container
      );
    };

    return <React.Fragment>{renderChildren()}</React.Fragment>;
  }
);

type Portal = typeof Portal & {
  Provider: typeof PortalProvider;
};

(Portal as Portal).Provider = PortalProvider;

export default Portal as Portal;
