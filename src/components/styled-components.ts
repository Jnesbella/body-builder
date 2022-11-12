import { get, isNil, isNumber, isUndefined } from "lodash";
import styled, { css } from "styled-components/native";

import { theme, getContrastColor } from "../styles";

import { zIndex as _zIndex } from "../styles/zIndex";

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

export const setStyleFromProps =
  <T extends object>(styleKey: string, propsKey: string, defaultValue?: any) =>
  (props: T) => {
    const styleValue = get(props, propsKey, defaultValue);

    if (isNil(styleValue)) {
      return;
    }

    return css<T>`
      ${styleKey}: ${styleValue};
    `;
  };

export interface Background {
  background?: string;
}

export const background = ({
  background = theme.colors.background,
}: Background = {}) => css<Background>`
  background: ${background};
`;

export interface Color {
  color?: string;
}

export function fontColor(props: Background | Color) {
  if ("background" in props && props.background) {
    return getContrastColor(props.background);
  }

  if ("color" in props && props.color) {
    return props.color;
  }

  return theme.colors.text;
}

export const getColor = fontColor;

export const color = css<Background | Color>`
  color: ${fontColor};
`;

export interface SpacingProps {
  spacing?: number;

  /**
   * @deprecated
   */
  size?: number;

  spacingSize?: number | [number, number];
}

export const spacing = ({
  spacing = theme.spacing,
  size = 0,
  spacingSize = size,
}: SpacingProps = {}) => {
  let spacingSizeX: number;
  let spacingSizeY: number;

  if (Array.isArray(spacingSize)) {
    [spacingSizeX, spacingSizeY] = spacingSize;
  } else {
    spacingSizeX = spacingSize;
    spacingSizeY = spacingSize;
  }

  return css<SpacingProps>`
    padding: ${spacingSizeY * spacing}px ${spacingSizeX * spacing}px;
  `;
};

export const fontSize = css<{ fontSize?: FontSize }>`
  font-size: ${(props) => props.fontSize || FontSize.Normal}px;
  line-height: 175%;
`;

export const fontWeight = css<{ fontWeight?: FontWeight }>`
  font-weight: ${(props) => props.fontWeight || FontWeight.Normal};
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

export const opacity = ({ opacity = 1 }: Opacity = {}) => css<Opacity>`
  opacity: ${opacity};
`;

export interface Rounded {
  roundness?: number;
}

export const rounded = ({
  roundness = theme.roundness,
}: Rounded = {}) => css<Rounded>`
  border-radius: ${roundness}px;
  overflow: hidden;
`;

export interface Greedy {
  greedy?: boolean;
}

export const greedy = ({ greedy }: Greedy = {}) =>
  greedy
    ? css<Greedy>`
        flex: 1;
      `
    : undefined;

export interface Full {
  fullWidth?: boolean;
  fullHeight?: boolean;
}

export const full = ({ fullHeight, fullWidth }: Full = {}) => {
  if (fullHeight && fullWidth) {
    return css<Full>`
      width: 100%;
      height: 100%;
    `;
  }

  if (fullWidth) {
    return css<Full>`
      width: 100%;
    `;
  }

  if (fullHeight) {
    return css<Full>`
      height: 100%;
    `;
  }
};

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

// export const flex = css<{ flex?: number } & Greedy>`
//   ${greedy};

//   ${(props) => {
//     if (props.flex) {
//       return { flex: props.flex };
//     }

//     return "";
//   }}
// `;

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
  ${({ maxWidth }) => {
    if (!isUndefined(maxWidth)) {
      return css`
        max-width: ${maxWidth}px;
      `;
    }
  }}

  ${({ maxHeight }) => {
    if (!isUndefined(maxHeight)) {
      return css`
        max-height: ${maxHeight}px;
      `;
    }
  }}
`;
