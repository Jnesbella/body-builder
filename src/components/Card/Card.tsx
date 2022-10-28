import * as React from "react";
import styled from "styled-components/native";

import { bordered, Bordered } from "../bordered";
import { rounded, Rounded } from "../styled-components";
import Surface, { SurfaceProps } from "../Surface";

import CardHeader from "./CardHeader";
import CardSubHeader from "./CardSubHeader";

const Container = styled(Surface)<SurfaceProps & Rounded & Bordered>`
  ${rounded};
  ${bordered};
`;

export interface CardProps {
  children?: React.ReactNode;
  header?: React.ReactNode;
  greedy?: boolean;
}

function Card({ children, header, greedy }: CardProps) {
  return (
    <Container greedy={greedy}>
      {header && (
        <React.Fragment>
          {header}

          {/* <Space /> */}
        </React.Fragment>
      )}

      {children}
    </Container>
  );
}

Card.Header = CardHeader;
Card.SubHeader = CardSubHeader;

export default Card;
