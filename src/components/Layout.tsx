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
} from "./styled-components";

export const LayoutBox = styled.View<Full & Greedy & Flexible & SpacingProps>`
  ${full};
  ${greedy};
  ${flexible};
  ${spacing};
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
