import { css } from "styled-components";

import { FontWeight, FontSize, Color } from "../../components";
import { theme } from "../../styles";

/**
 * TEXT
 */

export interface SlateTextProps {
  fontSize?: number;
  lineHeight?: number;
}

export const text = ({
  fontSize = FontSize.Normal,
  lineHeight = FontSize.Normal * 2,
}: SlateTextProps) => css<SlateTextProps>`
  font-size: ${fontSize}px;
  line-height: ${lineHeight}px;
`;

/**
 * BOLD
 */

export interface SlateBoldProps {
  bold?: boolean;
}

const boldStyle = css`
  font-weight: ${FontWeight.Bold};
`;

export const bold = ({ bold }: SlateBoldProps) => bold && boldStyle;

/**
 * ITALIC
 */

export interface SlateItalicProps {
  italic?: boolean;
}

const italicStyle = css`
  font-style: italic;
`;

export const italic = ({ italic }: SlateItalicProps) => italic && italicStyle;

/**
 * UNDERLINE
 */

export interface SlateUnderlineProps {
  underline?: boolean;
  color?: string;
}

export const underline = ({
  underline,
  color = theme.colors.primary,
}: SlateUnderlineProps) =>
  underline &&
  css<SlateUnderlineProps>`
    border-bottom: 1px solid ${color};
  `;

/**
 * STRIKETHROUGH
 */

export interface SlateStrikethroughProps {
  strikethrough?: boolean;
}

const strikethroughStyle = css`
  text-decoration: line-through;
`;

export const strikethrough = ({ strikethrough }: SlateStrikethroughProps) =>
  strikethrough && strikethroughStyle;

/**
 * CODE
 */

export interface SlateCodeProps {
  code?: boolean;
}

const codeStyle = css`
  font-family: monospace;
  background: ${theme.colors.backgroundInfo};
`;

export const code = ({ code }: SlateCodeProps) => code && codeStyle;
