import styled, { css } from "styled-components/native";

import { theme } from "../styles";

import { Background, background } from "./styled-components";

export interface DividerProps extends Background {
  height?: number | string;
  vertical?: boolean;
}

const Divider = styled.View.attrs<DividerProps>(({ background, height }) => ({
  background: background || theme.colors.backgroundDivider,
  height: height || "100%",
}))<DividerProps>`
  ${background};

  ${(props) => {
    if (props.vertical) {
      return css`
        height: ${props.height};
        width: ${theme.borderThickness}px;
      `;
    }

    return css`
      height: ${theme.borderThickness}px;
    `;
  }};
`;

export default Divider;
