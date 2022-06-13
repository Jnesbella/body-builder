import * as React from "react";
import { RenderLeafProps } from "slate-react";
import styled, { css } from "styled-components";

import { Text, FontWeight, FontSize } from "../../../components";
import { MarkType } from "../../../typings-slate";
import { log } from "../../../utils";

interface LeafTextProps extends Partial<Record<MarkType, boolean>> {}

const bold = css<{ bold?: boolean }>`
  font-weight: ${({ bold }) => (bold ? FontWeight.Bold : FontWeight.Normal)};
`;

const italic = css<{ italic?: boolean }>`
  font-style: ${({ italic }) => (italic ? "italic" : "normal")};
`;

const underline = css<{ underline?: boolean }>`
  text-decoration: ${({ underline }) => (underline ? "underline" : "none")};
`;

const strikethrough = css<{ strikethrough?: boolean }>`
  text-decoration: ${({ strikethrough }) =>
    strikethrough ? "line-through" : "none"};
`;

// TODO
const code = css<{ code?: boolean }>``;

const text = css`
  font-size: ${FontSize.Normal}px;
  line-height: ${FontSize.Normal * 2}px;
`;

const LeafText = styled.span<LeafTextProps>`
  ${bold};
  ${italic};
  ${underline};
  ${strikethrough};
  ${code};
  ${text};
`;

export interface SlateLeafProps extends RenderLeafProps {}

function SlateLeaf({ children, leaf, attributes }: SlateLeafProps) {
  log("SlateLeaf", { attributes });
  return (
    <LeafText {...attributes} {...leaf}>
      {children}
    </LeafText>
  );

  // const render = () => {
  //   if (leaf.bold) {
  //     return <strong>{children}</strong>;
  //   }

  //   if (leaf.code) {
  //     return <code>{children}</code>;
  //   }

  //   if (leaf.italic) {
  //     return <em>{children}</em>;
  //   }

  //   if (leaf.underline) {
  //     return <u>{children}</u>;
  //   }

  //   return children;
  // };

  // return <Text>{render()}</Text>;
}

export default SlateLeaf;
