import * as React from "react";
import { RenderLeafProps } from "slate-react";
import styled, { css } from "styled-components";

import { FontWeight, FontSize, Color, color } from "../../../components";
import { theme } from "../../../styles";
import { MarkType } from "../../../typings-slate";
import { log } from "../../../utils";

interface LeafTextProps extends Partial<Record<MarkType, boolean>> {}

const text = css`
  font-size: ${FontSize.Normal}px;
  line-height: ${FontSize.Normal * 2}px;
`;

const bold = css<{ bold?: boolean }>`
  ${({ bold }) => {
    if (bold) {
      return css`
        font-weight: ${FontWeight.Bold};
      `;
    }
  }};
`;

const italic = css<{ italic?: boolean }>`
  ${({ italic }) => {
    if (italic) {
      return css`
        font-style: italic;
      `;
    }
  }}
`;

const underline = css<{ underline?: boolean; text?: string } & Color>`
  ${({ underline, text: content, color }) => {
    if (underline) {
      return css`
        &:before {
          ${text};
          content: "${content}";
          position: absolute;
          text-decoration: underline ${color};
          color: ${theme.colors.transparent};
        }
      `;
    }
  }}
`;

const strikethrough = css<{ strikethrough?: boolean }>`
  ${({ strikethrough }) => {
    if (strikethrough) {
      return css`
        text-decoration: line-through;
      `;
    }
  }}
`;

const code = css<{ code?: boolean }>`
  ${({ code }) => {
    if (code) {
      return css`
        font-family: monospace;
        background: ${theme.colors.backgroundInfo};
      `;
    }
  }}
`;

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
  log("SlateLeaf", { attributes, leaf });

  const color = leaf.code ? theme.colors.textCode : theme.colors.text;

  return (
    <LeafText {...attributes} {...leaf} color={color}>
      {children}
    </LeafText>
  );
}

export default SlateLeaf;
