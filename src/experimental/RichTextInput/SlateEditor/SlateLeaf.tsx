import * as React from "react";
import { RenderLeafProps } from "slate-react";
import styled, { css } from "styled-components";

import { FontWeight, FontSize, Color, color } from "../../../components";
import { theme } from "../../../styles";
import { MarkType } from "../../../typings-slate";
import { log } from "../../../utils";

import {
  text,
  bold,
  italic,
  underline,
  strikethrough,
  code,
} from "./slateStyles";

interface LeafTextProps extends Partial<Record<MarkType, boolean>> {}

const LeafText = styled.span<LeafTextProps>`
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
    <LeafText {...attributes} {...leaf} color={color}>
      {children}
    </LeafText>
  );
}

export default SlateLeaf;
