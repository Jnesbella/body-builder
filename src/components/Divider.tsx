import styled, { css } from "styled-components/native";

import { theme } from "../styles";

import { Background, background } from "./styled-components";

export interface DividerProps extends Background {
  height?: number | string;
  width?: number | string;
  vertical?: boolean;
}

const Divider = styled.View.attrs<DividerProps>(
  ({ background, height, width }) => ({
    background: background || theme.colors.backgroundDivider,
    height: height || "100%",
    width: width || "100%",
  })
)<DividerProps>`
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
      width: ${props.width};
    `;
  }};
`;

export default Divider;
