import styled from "styled-components/native";

import { theme } from "../styles";

import {
  Background,
  background,
  elevation,
  Greedy,
  ElevationProps,
} from "./styled-components";
import Layout from "./Layout";

const Surface = styled(Layout.Box).attrs(
  ({ background = theme.colors.background }: Background) => ({
    background,
  })
)<Greedy & ElevationProps>`
  ${background};
  ${elevation};
`;

export default Surface;
