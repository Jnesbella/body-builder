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

export interface SurfaceProps
  extends LayoutBoxProps,
    Background,
    ElevationProps,
    Greedy {}

const Surface = styled(Layout.Box).attrs<SurfaceProps>(
  ({ background = theme.colors.background }) => ({
    background,
  })
)<SurfaceProps>`
  ${background};
  ${elevation};
`;

export default Surface;
