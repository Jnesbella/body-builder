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
} from "./styled-components";

export interface TextProps extends Color {
  fontWeight?: FontWeight;
  fontSize?: FontSize;
  textAlign?: TextAlign;
}

const text = css<TextProps>`
  ${color};
  ${fontWeight};
  ${fontSize};
  ${textAlign};
`;

export const DefaultText = styled.Text.attrs<TextProps>((props) => ({
  fontWeight: props.fontWeight || FontWeight.Normal,
  fontSize: props.fontSize || FontSize.Normal,
  textAlign: props.textAlign || TextAlign.Left,
}))<TextAlignProps>`
  ${text};
`;

// export type TextProps = React.ComponentProps<typeof Text>;

export const paragraph = css`
  font-size: ${FontSize.Normal}px;
  line-height: ${FontSize.Normal * 1.5}px;
  font-weight: ${FontWeight.Normal};
`;

export const heading = css`
  font-size: ${FontSize.Large}px;
  line-height: ${FontSize.Large * 1.5}px;
  font-weight: ${FontWeight.Bold};
`;

export const subheading = css`
  font-size: ${FontSize.Medium}px;
  line-height: ${FontSize.Medium * 1.5}px;
  font-weight: ${FontWeight.SemiBold};
`;

export const caption = css`
  font-size: ${FontSize.Small}px;
  line-height: ${FontSize.Small * 1.5}px;
  font-weight: ${FontWeight.Light};
`;

export const label = css`
  font-size: ${FontSize.Normal}px;
  line-height: ${FontSize.Normal * 1.5}px;
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

function Text(props: React.ComponentProps<typeof DefaultText>) {
  return <DefaultText {...props} />;
}

Text.Title = Title;
Text.SubHeader = SubHeader;
Text.Paragraph = Paragraph;
Text.Label = Label;
Text.Caption = Caption;

export default Text;
