import { css } from "styled-components/native";

import { theme } from "../styles";

export interface Bordered {
  borderColor?: string;
  borderWidth?: number;
}

export const bordered = ({
  borderColor = theme.colors.backgroundDivider,
  borderWidth = theme.borderThickness,
}: Bordered = {}) => css<Bordered>`
  border: ${borderWidth}px solid ${borderColor};
`;
