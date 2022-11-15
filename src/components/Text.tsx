import * as React from "react";
import styled, { css } from "styled-components/native";
import { theme } from "../styles";

import {
  Color,
  FontSize,
  color,
  fontSize,
  fontWeight,
  FontWeight,
  TextAlign,
  textAlign,
  TextAlignProps,
  Background,
} from "./styled-components";

export interface DefaultTextProps extends Color, Background {
  fontWeight?: FontWeight;
  fontSize?: FontSize;
  textAlign?: TextAlign;
}

export const text = css<DefaultTextProps>`
  ${color};
  ${fontWeight};
  ${fontSize};
  ${textAlign};
`;

export const DefaultText = styled.Text.attrs<DefaultTextProps>((props) => ({
  fontWeight: props.fontWeight || FontWeight.Normal,
  fontSize: props.fontSize || FontSize.Normal,
  textAlign: props.textAlign || TextAlign.Left,
}))<TextAlignProps>`
  ${text};
`;

// export type TextProps = React.ComponentProps<typeof Text>;

const LINE_SPACING = 1.5;

export const paragraph = css`
  font-size: ${FontSize.Normal}px;
  line-height: ${FontSize.Normal * LINE_SPACING}px;
  font-weight: ${FontWeight.Normal};
`;

export const heading = css`
  font-size: ${FontSize.Large}px;
  line-height: ${FontSize.Large * LINE_SPACING}px;
  font-weight: ${FontWeight.Bold};
`;

export const subheading = css`
  font-size: ${FontSize.Medium}px;
  line-height: ${FontSize.Medium * LINE_SPACING}px;
  font-weight: ${FontWeight.SemiBold};
`;

export const caption = css`
  font-size: ${FontSize.Small}px;
  line-height: ${FontSize.Small * LINE_SPACING}px;
  font-weight: ${FontWeight.Light};
`;

export const label = css`
  font-size: ${FontSize.Normal}px;
  line-height: ${FontSize.Normal * LINE_SPACING}px;
  font-weight: ${FontWeight.Medium};
`;

export const Paragraph = styled(Text)<Color>`
  padding-top: ${theme.spacing}px;
  padding-bottom: ${theme.spacing}px;
  line-height: 150%;
`;

export const Title = styled(Text).attrs({
  fontSize: FontSize.Large,
})<Color>``;

export const SubHeader = styled(Text).attrs({
  fontSize: FontSize.Medium,
})<Color>``;

export const Label = styled(Text).attrs({
  fontWeight: FontWeight.Medium,
  fontSize: FontSize.Small,
})<Color & TextAlignProps>`
  text-transform: uppercase;
`;

export const Caption = styled(Text).attrs({
  fontWeight: FontWeight.Light,
  fontSize: FontSize.Small,
})``;

export const HelperText = styled(Text)``;

export type TextProps = React.ComponentProps<typeof DefaultText>;

function Text(props: TextProps) {
  return <DefaultText {...props} />;
}

Text.Title = Title;
Text.SubHeader = SubHeader;
Text.Paragraph = Paragraph;
Text.Label = Label;
Text.Caption = Caption;

export default Text;
