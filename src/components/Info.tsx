import styled from "styled-components/native";

import { theme } from "../styles";

import { Background, background, Rounded, rounded } from "./styled-components";
import Layout from "./Layout";

const Info = styled(Layout.Box).attrs(
  ({ background = theme.colors.backgroundInfo }: Background) => ({
    background,
  })
)<Rounded>`
  ${background};
  ${rounded};
`;

export default Info;
