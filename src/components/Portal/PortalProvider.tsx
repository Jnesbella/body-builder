import * as React from "react";
import styled from "styled-components";

import { greedy } from "../styled-components";

export interface PortalState {
  container: HTMLDivElement | null;
}

export const PortalState = React.createContext<PortalState | null>(null);

export interface PortalProviderProps {
  children: React.ReactNode;
}

export function usePortalState<Output>(
  selector: (state: PortalState) => Output
) {
  const state = React.useContext(PortalState);

  if (state === null) {
    throw new Error("usePortalState must be used within a PortalProvider");
  }

  return selector(state);
}

const PortalProviderContainer = styled.div.attrs({ greedy: true })`
  ${greedy};

  position: relative;
  display: flex;
`;

export type PortalProviderElement = HTMLDivElement;

export interface PortalProviderProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

const PortalProvider = React.forwardRef<
  PortalProviderElement,
  PortalProviderProps
>(({ children, ...rest }, ref) => {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);

  React.useEffect(function handleRef() {
    if (typeof ref === "function") {
      ref(container);
    } else if (ref) {
      ref.current = container;
    }
  });

  return (
    <PortalProviderContainer {...rest} ref={(node) => setContainer(node)}>
      <PortalState.Provider value={{ container }}>
        {children}
      </PortalState.Provider>
    </PortalProviderContainer>
  );
});

export default PortalProvider;
