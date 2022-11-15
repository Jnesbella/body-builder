import * as React from "react";
import styled, { css } from "styled-components";
import { useSetRef } from "../../hooks";

import { Greedy, greedy } from "../styled-components";

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

const PortalProviderContainer = styled.div<Greedy>`
  ${greedy};

  position: relative;

  ${({ greedy }) => {
    if (greedy) {
      return css`
        display: flex;
      `;
    }
  }}
`;

export type PortalProviderElement = HTMLDivElement;

export interface PortalProviderProps
  extends React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    Greedy {}

const PortalProvider = React.forwardRef<
  PortalProviderElement,
  PortalProviderProps
>(({ children, greedy, ...rest }, ref) => {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);

  useSetRef(ref, container);

  // React.useEffect(function handleRef() {
  //   if (typeof ref === "function") {
  //     ref(container);
  //   } else if (ref) {
  //     ref.current = container;
  //   }
  // });

  return (
    <PortalProviderContainer
      {...rest}
      greedy={greedy}
      ref={(node) => setContainer(node)}
    >
      <PortalState.Provider value={{ container }}>
        {children}
      </PortalState.Provider>
    </PortalProviderContainer>
  );
});

export default PortalProvider;
