import styled from "styled-components/native";

import { theme } from "../styles";

import {
  Background,
  background,
  elevation,
  Greedy,
  ElevationProps,
} from "./styled-components";
import Layout, { LayoutBoxProps } from "./Layout";

const Surface = styled(Layout.Box).attrs(
  ({ background = theme.colors.background }: Background) => ({
    background,
  })
)<Greedy & ElevationProps & LayoutBoxProps>`
  ${background};
  ${elevation};
`;

export default Surface;
