import styled, { css } from "styled-components/native";

import { theme } from "../styles";

import { Background, background } from "./styled-components";

const Divider = styled.View.attrs(({ background }: Background) => ({
  background: background || theme.colors.backgroundDivider,
}))<{ vertical?: boolean }>`
  ${background};

  ${(props) => {
    if (props.vertical) {
      return css`
        height: 100%;
        width: ${theme.borderThickness}px;
      `;
    }

    return css`
      height: ${theme.borderThickness}px;
    `;
  }};
`;

export default Divider;
