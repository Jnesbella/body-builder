import styled from "styled-components/native";

import {
  Full,
  Greedy,
  Flexible,
  SpacingProps,
  full,
  greedy,
  flexible,
  spacing,
  opacity,
  Opacity,
  max,
  MaxProps,
} from "./styled-components";

export interface LayoutBoxProps
  extends Full,
    Greedy,
    Flexible,
    SpacingProps,
    Opacity,
    MaxProps {}

export const LayoutBox = styled.View<LayoutBoxProps>`
  ${full};
  ${greedy};
  ${flexible};
  ${spacing};
  ${opacity};
  ${max};

  position: static;
`;

export const LayoutRow = styled(LayoutBox)`
  flex-direction: row;
`;

export const LayoutColumn = styled(LayoutBox)`
  flex-direction: column;
`;

export const LayoutGrid = styled(LayoutRow)`
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
`;

export default {
  Box: LayoutBox,
  Column: LayoutColumn,
  Row: LayoutRow,
  Grid: LayoutGrid,
};
