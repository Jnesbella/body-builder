import * as React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import { log } from "../../utils";
import { zIndex } from "../styled-components";

import PortalProvider, { usePortalState } from "./PortalProvider";

const PortalContainer = styled.div<{ top: number; left: number }>`
  ${zIndex("aboveAll")};
  position: absolute;

  left: ${({ left }) => left}px;
  top: ${({ top }) => top}px;
`;

export type PortalElement = HTMLDivElement;

export interface PortalProps {
  children: React.ReactNode;
  top?: number;
  left?: number;
}

export const Portal = React.forwardRef<PortalElement, PortalProps>(
  ({ children, top = 0, left = 0 }, ref) => {
    const container = usePortalState((state) => state.container);

    React.useEffect(function handleRef() {
      if (typeof ref === "function") {
        ref(container);
      } else if (ref) {
        ref.current = container;
      }
    });

    return (
      <React.Fragment>
        {container &&
          ReactDOM.createPortal(
            <PortalContainer top={top} left={left}>
              {children}
            </PortalContainer>,
            container
          )}
      </React.Fragment>
    );
  }
);

type Portal = typeof Portal & {
  Provider: typeof PortalProvider;
};

(Portal as Portal).Provider = PortalProvider;

export default Portal as Portal;
