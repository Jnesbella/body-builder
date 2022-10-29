import * as React from "react";
import { RenderLeafProps } from "slate-react";
import styled, { css } from "styled-components";

import { FontWeight, FontSize, Color, color } from "../../components";
import { theme } from "../../styles";
import { MarkType, MarkRecord } from "../../slateTypings";
import { log } from "../../utils";

import {
  text,
  bold,
  italic,
  underline,
  strikethrough,
  code,
  SlateTextProps,
} from "./slateStyles";

interface SlateLeafTextProps extends MarkRecord, SlateTextProps {}

const SlateLeafText = styled.span<SlateLeafTextProps>`
  ${text};
  ${color};

  ${bold};
  ${italic};
  ${underline};
  ${strikethrough};
  ${code};
`;

export interface SlateLeafProps extends RenderLeafProps {}

function SlateLeaf({ children, leaf, attributes }: SlateLeafProps) {
  const color = leaf.code ? theme.colors.textCode : theme.colors.text;

  return (
    <SlateLeafText {...attributes} {...leaf} color={color}>
      {children}
    </SlateLeafText>
  );
}

export default SlateLeaf;
