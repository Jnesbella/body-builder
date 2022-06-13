import * as React from "react";
import { RenderElementProps } from "slate-react";
import styled, { css } from "styled-components";

import { FontSize, Text } from "../../../components";

export interface SlateElementProps extends RenderElementProps {}

const text = css`
  font-size: ${FontSize.Normal}px;
  line-height: ${FontSize.Normal * 2}px;
`;

const Paragraph = styled.p`
  padding: 8px 0;
`;

function SlateElement({ attributes, children, element }: SlateElementProps) {
  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;

    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;

    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;

    case "heading":
      return <h1 {...attributes}>{children}</h1>;

    case "list-item":
      return <li {...attributes}>{children}</li>;

    default:
      return <Paragraph {...attributes}>{children}</Paragraph>;
  }
}

export default SlateElement;
