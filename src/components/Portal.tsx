import { get } from "lodash";
import * as React from "react";
import ReactDOM from "react-dom";
import { LayoutRectangle } from "react-native";
import styled from "styled-components";
import { log } from "../utils";

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

const PortalProviderContainer = styled.div`
  position: relative;
`;

export interface PortalProviderProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

function PortalProvider({ children, ...rest }: PortalProviderProps) {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);

  return (
    <PortalProviderContainer {...rest} ref={(node) => setContainer(node)}>
      <PortalState.Provider value={{ container }}>
        {children}
      </PortalState.Provider>
    </PortalProviderContainer>
  );
}

const PortalContainer = styled.div<{ top: number; left: number }>`
  position: absolute;
  left: ${({ left }) => left}px;
  top: ${({ top }) => top}px;
`;

export interface PortalProps {
  children: React.ReactNode;
  top?: number;
  left?: number;
}

export function Portal({ children, top = 0, left = 0 }: PortalProps) {
  const container = usePortalState((state) => state.container);

  log("Portal: ", {
    container,
    left,
    top,
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

Portal.Provider = PortalProvider;

export default Portal;
