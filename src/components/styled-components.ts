import { isUndefined } from "lodash";
import styled, { css } from "styled-components/native";
import { TextInput as DefaultTextInput } from "react-native";

import { theme, getContrastColor } from "../styles";

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
  ${({ background }) => {
    if (background) {
      return css`
        background: ${background};
      `;
    }

    return "";
  }}
`;

export interface Color {
  color?: string;
}

export const color = css<Background | Color>`
  color: ${(props) => {
    if ("color" in props) {
      return props.color;
    }

    if ("background" in props) {
      return props.background && getContrastColor(props.background);
    }

    return theme.colors.text;
  }};
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

export interface Roundness {
  roundness?: number;
}

export const rounded = css<Roundness>`
  border-radius: ${(props) =>
    isUndefined(props.roundness) ? theme.roundness : props.roundness}px;
  overflow: hidden;
`;

export const greedy = css<Greedy>`
  ${(props) => {
    if (props.greedy) {
      return { flex: 1 };
    }

    return "";
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
}

export const bordered = css<Bordered>`
  ${({ borderColor = theme.colors.backgroundDivider }) => {
    return css`
      border: ${theme.borderThickness}px solid ${borderColor};
    `;
  }};
`;

export const Divider = styled.View.attrs(({ background }: Background) => ({
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

export const LayoutBox = styled.View<Full & Greedy & Flexible & SpacingProps>`
  ${full};
  ${greedy};
  ${flexible};
  ${spacing};
`;

export const LayoutRow = styled(LayoutBox)`
  flex-direction: row;
`;

export const LayoutColumn = styled(LayoutBox)`
  flex-direction: column;
`;

export const LayoutGrid = styled(LayoutRow)`
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
`;

export const Surface = styled(LayoutBox).attrs(
  ({ background = theme.colors.background }: Background) => ({
    background,
  })
)<Greedy>`
  ${background};
`;

export const Info = styled(LayoutBox).attrs(
  ({ background = theme.colors.backgroundInfo }: Background) => ({
    background,
  })
)<Roundness>`
  ${background};
  ${rounded};
`;

type TextInputProps = React.ComponentProps<typeof DefaultTextInput> &
  Greedy &
  Full & {
    // readonly?: boolean
  };

export const TextInput = styled.TextInput.attrs(
  ({ editable = true }: { editable?: boolean; multiline?: boolean }) => ({
    fontSize: FontSize.Normal,
    outlineColor: theme.colors.primary,
    borderColor: !editable
      ? theme.colors.transparent
      : theme.colors.backgroundDivider,
  })
)<TextInputProps>`
  ${color};
  ${fontSize};
  ${outlineColor};
  ${rounded};
  ${bordered};
  ${greedy};
  ${full};

  padding: 0 ${theme.spacing}px;
  background: transparent;

  ${({ multiline }) => {
    if (multiline) {
      return css`
        font-size: 14px;
        line-height: 19px;
      `;
    }
  }}
`;
