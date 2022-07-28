import { css } from "styled-components";

import { FontWeight, FontSize, Color } from "../../../components";
import { theme } from "../../../styles";

export const text = css`
  font-size: ${FontSize.Normal}px;
  line-height: ${FontSize.Normal * 2}px;
`;

export const bold = css<{ bold?: boolean }>`
  ${({ bold }) => {
    if (bold) {
      return css`
        font-weight: ${FontWeight.Bold};
      `;
    }
  }};
`;

export const italic = css<{ italic?: boolean }>`
  ${({ italic }) => {
    if (italic) {
      return css`
        font-style: italic;
      `;
    }
  }}
`;

export const underline = css<{ underline?: boolean; text?: string } & Color>`
  ${({ underline, color }) => {
    if (underline) {
      return css`
        border-bottom: 1px solid ${color || theme.colors.primary};
      `;

      // return css`
      //   &:before {
      //     ${text};
      //     content: "${content}";
      //     position: absolute;
      //     top: 0;
      //     left: 0;
      //     text-decoration: underline ${color};
      //     color: ${theme.colors.transparent};
      //   }
      // `;
    }
  }}
`;

export const strikethrough = css<{ strikethrough?: boolean }>`
  ${({ strikethrough }) => {
    if (strikethrough) {
      return css`
        text-decoration: line-through;
      `;
    }
  }}
`;

export const code = css<{ code?: boolean }>`
  ${({ code }) => {
    if (code) {
      return css`
        font-family: monospace;
        background: ${theme.colors.backgroundInfo};
      `;
    }
  }}
`;
