import styled from "styled-components/native";

import { theme } from "../styles";

import { Background, background, Greedy } from "./styled-components";
import Layout from "./Layout";

const Surface = styled(Layout.Box).attrs(
  ({ background = theme.colors.background }: Background) => ({
    background,
  })
)<Greedy>`
  ${background};
`;

export default Surface;
