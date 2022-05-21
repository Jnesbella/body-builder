import * as React from "react";
import styled from "styled-components/native";
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

export const DefaultText = styled.Text.attrs<{
  fontWeight?: FontWeight;
  fontSize?: FontSize;
  textAlign?: TextAlign;
}>((props) => ({
  fontWeight: props.fontWeight || FontWeight.Normal,
  fontSize: props.fontSize || FontSize.Normal,
  textAlign: props.textAlign || TextAlign.Left,
}))<TextAlignProps>`
  ${color};
  ${fontWeight};
  ${fontSize};
  ${textAlign};
`;

export type TextProps = React.ComponentProps<typeof Text>;

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
