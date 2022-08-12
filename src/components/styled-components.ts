import { isNumber, isUndefined } from "lodash";
import styled, { css } from "styled-components/native";

import { theme, getContrastColor } from "../styles";

import { zIndex as _zIndex } from "../styles/zIndex";

export interface Greedy {
  greedy?: boolean;
}

export enum FontWeight {
  Light = 300,
  Normal = 400,
  Medium = 500,
  SemiBold = 600,
  Bold = 700,
}

export enum FontSize {
  ExtraSmall = theme.spacing * 1,
  Small = theme.spacing * 1.5,
  Normal = theme.spacing * 2,
  Medium = theme.spacing * 2.5,
  Large = theme.spacing * 3,
}

export enum TextAlign {
  Center = "center",
  Left = "left",
}

export enum JustifyContent {
  Center = "center",
  FlexStart = "flex-start",
  FlexEnd = "flex-end",
  SpaceBetween = "space-between",
}

export enum AlignItems {
  Center = "center",
  FlexStart = "flex-start",
  FlexEnd = "flex-end",
  Stretch = "stretch",
}

export interface Background {
  background?: string;
}

export const background = css<Background>`
  ${(props) => {
    if (props.background) {
      return css`
        background: ${props.background};
      `;
    }

    return "";
  }}
`;

export interface Color {
  color?: string;
}

export function getColor(props: Background | Color) {
  if ("color" in props && props.color) {
    return props.color;
  }

  if ("background" in props && props.background) {
    return getContrastColor(props.background);
  }

  return theme.colors.text;
}

export const color = css<Background | Color>`
  color: ${getColor};
`;

export interface SpacingProps {
  spacing?: number;

  /**
   * @deprecated
   */
  size?: number;

  spacingSize?: number | [number, number];
}

export const spacing = css<SpacingProps>`
  ${({ spacing = theme.spacing, size = 0, spacingSize = size }) => {
    let spacingSizeX: number;
    let spacingSizeY: number;

    if (Array.isArray(spacingSize)) {
      [spacingSizeX, spacingSizeY] = spacingSize;
    } else {
      spacingSizeX = spacingSize;
      spacingSizeY = spacingSize;
    }

    return css`
      padding: ${spacingSizeY * spacing}px ${spacingSizeX * spacing}px;
    `;
  }}
`;

export const fontSize = css<{ fontSize?: FontSize }>`
  font-size: ${(props) => props.fontSize}px;
  line-height: 175%;
`;

export const fontWeight = css<{ fontWeight?: FontWeight }>`
  font-weight: ${(props) => props.fontWeight};
`;

export interface TextAlignProps {
  textAlign?: TextAlign;
}

export const textAlign = css<TextAlignProps>`
  text-align: ${(props) => props.textAlign};
`;

export const outlineColor = css<{ outlineColor?: string }>`
  outline-color: ${(props) => props.outlineColor || theme.colors.black};
`;

export interface Opacity {
  opacity?: number;
}

export const opacity = css<Opacity>`
  opacity: ${(props) => (isNumber(props.opacity) ? props.opacity : 1)};
`;

export interface Rounded {
  roundness?: number;
}

export const rounded = css<Rounded>`
  border-radius: ${(props) =>
    isUndefined(props.roundness) ? theme.roundness : props.roundness}px;
  overflow: hidden;
`;

export const greedy = css<Greedy>`
  ${({ greedy }) => {
    if (greedy) {
      return css`
        flex: 1;
      `;
    }
  }}
`;

export const flex = css<{ flex?: number } & Greedy>`
  ${greedy};

  ${(props) => {
    if (props.flex) {
      return { flex: props.flex };
    }

    return "";
  }}
`;

export interface Full {
  fullWidth?: boolean;
  fullHeight?: boolean;
}

export const full = css<Full>`
  ${(props) => {
    if (props.fullHeight && props.fullWidth) {
      return css`
        width: 100%;
        height: 100%;
      `;
    }

    if (props.fullWidth) {
      return css`
        width: 100%;
      `;
    }

    if (props.fullHeight) {
      return css`
        height: 100%;
      `;
    }

    return "";
  }}
`;

export interface Bordered {
  borderColor?: string;
  borderWidth?: number;
}

export const bordered = css<Bordered>`
  ${({
    borderColor = theme.colors.backgroundDivider,
    borderWidth = theme.borderThickness,
  }) => {
    return css`
      border: ${borderWidth}px solid ${borderColor};
    `;
  }};
`;

export const Space = styled.View<SpacingProps>`
  ${(props) => {
    const spacing = props.spacing || theme.spacing;
    const size =
      props.size ||
      (Array.isArray(props.spacingSize)
        ? props.spacingSize[0]
        : props.spacingSize) ||
      1;

    return css`
      height: ${spacing * size}px;
      width: ${spacing * size}px;
    `;
  }};
`;

export interface Flexible {
  flex?: React.ReactText;
  alignItems?: string;
  justifyContent?: string;
}

export const flexible = css<Flexible>`
  ${(props) => {
    if (!isUndefined(props.flex)) {
      return css`
        flex: ${props.flex};
      `;
    }

    return "";
  }}

  align-items: ${(props) => props.alignItems};
  justify-content: ${(props) => props.justifyContent};
`;

export interface ElevationProps {
  elevation?: number;
}

export const elevation = css<ElevationProps>`
  ${({ elevation }) => {
    if (isNumber(elevation) && elevation >= 0) {
      const elevationSize = theme.spacing * elevation;

      return css`
        elevation: ${elevation};
        box-shadow: 0px ${elevationSize / 2}px ${elevationSize}px
          ${theme.colors.backgroundDisabled};
      `;
    }

    return "";
  }}
`;

export const zIndex = (zIndex: keyof typeof _zIndex) => css`
  z-index: ${_zIndex[zIndex]};
`;

export interface MaxProps {
  maxWidth?: number;
  maxHeight?: number;
}

export const max = css<MaxProps>`
  ${({ maxHeight, maxWidth }) => {
    if (!isUndefined(maxWidth)) {
      return css`
        max-width: ${maxWidth}px;
      `;
    }

    if (!isUndefined(maxHeight)) {
      return css`
        max-height: ${maxHeight}px;
      `;
    }
  }}
`;
