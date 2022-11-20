import * as React from "react";
import styled from "styled-components";

export const VoidContainer = styled.div``;

export type VoidElement = HTMLDivElement;

export type VoidProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const VoidElement = React.forwardRef<VoidElement, VoidProps>(
  ({ children, ...rest }, ref) => {
    return (
      <VoidContainer {...rest} ref={ref} contentEditable={false}>
        {children}
      </VoidContainer>
    );
  }
);

export default VoidElement;
