import styled, { css } from "styled-components/native";

import { theme } from "../styles";

import { Background, background } from "./styled-components";

export interface DividerProps extends Background {
  height?: number | string;
  width?: number | string;
  vertical?: boolean;
  thickness?: number;
}

const Divider = styled.View.attrs<DividerProps>(
  ({
    background = theme.colors.backgroundDivider,
    height = "100%",
    width = "100%",
    thickness = theme.borderThickness,
  }) => ({
    background,
    height,
    width,
    thickness,
  })
)<DividerProps>`
  ${background};

  ${(props) => {
    if (props.vertical) {
      return css`
        height: ${props.height};
        width: ${props.thickness}px;
      `;
    }

    return css`
      height: ${props.thickness}px;
      width: ${props.width};
    `;
  }};
`;

export default Divider;
