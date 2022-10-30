import * as React from "react";
import { RenderElementProps } from "slate-react";
import styled, { css } from "styled-components";

import {
  paragraph,
  heading,
  subheading,
  caption,
  label,
} from "../../../components";
import { FormatElement } from "../../../slateTypings";

import { TEXT_ALIGN_DEFAULT } from "../slateConstants";

export interface SlateElementProps extends RenderElementProps {}

const textAlign = css`
  text-align: ${({ textAlign }: { textAlign?: FormatElement["textAlign"] }) =>
    textAlign || TEXT_ALIGN_DEFAULT};
`;

const Paragraph = styled.p`
  ${paragraph};
  ${textAlign};

  margin: 0;
  padding: 0;
  min-width: 1px;
`;

export const Normal = Paragraph;

export const Heading = styled(Normal)`
  ${textAlign};
  ${heading};
`;

export const Subheading = styled(Normal)`
  ${subheading};
`;

export const Caption = styled(Normal)`
  ${caption};
`;

export const Label = styled(Normal)`
  ${label};
`;

interface FormatElementTextProps {
  type?: FormatElement["type"];
  textAlign?: FormatElement["textAlign"];
  children?: React.ReactNode;
  contentEditable?: boolean;
}

const FormatElementText = React.forwardRef<
  HTMLParagraphElement,
  FormatElementTextProps
>(({ type, children, ...attributes }, ref) => {
  switch (type) {
    case "heading":
      return (
        <Heading {...attributes} ref={ref}>
          {children}
        </Heading>
      );

    case "subheading":
      return (
        <Subheading {...attributes} ref={ref}>
          {children}
        </Subheading>
      );

    case "caption":
      return (
        <Caption {...attributes} ref={ref}>
          {children}
        </Caption>
      );

    case "label":
      return (
        <Label {...attributes} ref={ref}>
          {children}
        </Label>
      );

    default:
      return (
        <Paragraph {...attributes} ref={ref}>
          {children}
        </Paragraph>
      );
  }
});

export default FormatElementText;
