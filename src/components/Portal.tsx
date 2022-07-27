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

export interface PortalProviderProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

function PortalProvider({ children, ...rest }: PortalProviderProps) {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);

  return (
    <div {...rest} ref={(node) => setContainer(node)}>
      <PortalState.Provider value={{ container }}>
        {children}
      </PortalState.Provider>
    </div>
  );
}

const PortalContainer = styled.div<{ top: number; left: number }>`
  position: absolute;
  left: ${({ left }) => left}px;
  top: ${({ top }) => top}px;
`;

export interface PortalProps {
  children: React.ReactNode;
  layout?: LayoutRectangle;
  verticalOffset?: number;
  horizontalOffset?: number;
}

export function Portal({
  children,
  layout,
  verticalOffset = 0,
  horizontalOffset = 0,
}: PortalProps) {
  const container = usePortalState((state) => state.container);
  const left = get(layout, "left", 0);
  const top = get(layout, "top", 0) + get(layout, "height", 0);

  // log("Portal: ", { container, layout });

  return (
    <React.Fragment>
      {container &&
        ReactDOM.createPortal(
          <PortalContainer
            top={top + verticalOffset}
            left={left + horizontalOffset}
          >
            {children}
          </PortalContainer>,
          container
        )}
    </React.Fragment>
  );
}

Portal.Provider = PortalProvider;

export default Portal;
