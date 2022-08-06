import * as React from "react";
import { ReactEditor, RenderElementProps, useSlate } from "slate-react";
import styled, { css } from "styled-components";
import * as Icons from "react-bootstrap-icons";

import {
  Icon,
  IconButton,
  Layout,
  spacing,
  paragraph,
  heading,
  subheading,
  caption,
  label,
} from "../../../components";
import { FormatElement, ListItemElement } from "../../../typings-slate";
import { log } from "../../../utils";
import { Editor, Element } from "./slate";
import { Node, Transforms } from "slate";
import { isNumber, last } from "lodash";
import { theme } from "../../../styles";

export interface SlateElementProps extends RenderElementProps {}

const Paragraph = styled.p`
  ${paragraph};

  margin: 0;
  padding: 0;
  min-width: 1px;
`;

export const Normal = Paragraph;

export const Heading = styled(Normal)`
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

const ListContainer = styled.div.attrs({ spacingSize: [0, 0.5] })`
  ${spacing};
`;

type ButtetListProps = SlateElementProps["attributes"] & {
  children: SlateElementProps["children"];
};

const BulletList = React.forwardRef<any, ButtetListProps>(
  ({ children, ...rest }, ref) => {
    return (
      <ListContainer {...rest} ref={ref}>
        {children}
      </ListContainer>
    );
  }
);

type NumberListProps = SlateElementProps["attributes"] & {
  children: SlateElementProps["children"];
};

const NumberList = React.forwardRef<any, NumberListProps>(
  ({ children, ...rest }, ref) => {
    return (
      <ListContainer {...rest} ref={ref}>
        {children}
      </ListContainer>
    );
  }
);

type TaskListProps = SlateElementProps["attributes"] & {
  children: SlateElementProps["children"];
};

const TaskList = React.forwardRef<any, TaskListProps>(
  ({ children, ...rest }, ref) => {
    return (
      <ListContainer {...rest} ref={ref}>
        {children}
      </ListContainer>
    );
  }
);

type ListItemProps = SlateElementProps["attributes"] & {
  element: ListItemElement;
  children: SlateElementProps["children"];
};

const ListItemIconWrapper = styled.span`
  ${spacing};

  min-width: ${theme.spacing * (theme.spacing - 1)}px;
  display: flex;
  justify-content: right;
`;

const ListItem = React.forwardRef<any, ListItemProps>(
  ({ children, element, ...rest }, ref) => {
    const editor = useSlate();

    const path = ReactEditor.findPath(editor, element);
    const index = last(path);
    const [firstChild] = element.children || [];
    const { type: formatType } = firstChild || {};

    const toggleChecked = () => {
      Transforms.setNodes(
        editor,
        {
          checked: !element.checked,
        },
        {
          match: (node) =>
            !Editor.isEditor(node) &&
            Element.isElement(node) &&
            Element.matches(node, element),
          at: path,
        }
      );
    };

    return (
      <Layout.Row {...rest} ref={ref} alignItems="baseline">
        <ListItemIconWrapper spacingSize={[1, 0]}>
          <FormatElementText type={formatType} contentEditable={false}>
            {element.listType === "task-list" && (
              <IconButton
                size="small"
                icon={element.checked ? Icons.CheckCircle : Icons.Circle}
                onPress={toggleChecked}
              />
            )}

            {element.listType === "bullet-list" && <Icon icon={Icons.Dot} />}

            {element.listType === "number-list" && isNumber(index) && (
              <React.Fragment>{index + 1}.</React.Fragment>
            )}
          </FormatElementText>
        </ListItemIconWrapper>

        {children}
      </Layout.Row>
    );
  }
);

function SlateElement(props: SlateElementProps) {
  const { children, element, attributes } = props;

  const editor = useSlate();
  const path = ReactEditor.findPath(editor, element);

  if (Element.isElement(element) && Element.isFormatElement(element)) {
    return (
      <FormatElementText {...attributes} type={(element as FormatElement).type}>
        {children}
      </FormatElementText>
    );
  }

  switch (element.type) {
    // case "block-quote":
    //   return <blockquote {...attributes}>{children}</blockquote>;

    case "bullet-list":
      return <BulletList {...attributes}>{children}</BulletList>;

    case "number-list":
      return <NumberList {...attributes}>{children}</NumberList>;

    case "task-list":
      return <TaskList {...attributes}>{children}</TaskList>;

    case "list-item":
      return (
        <ListItem {...attributes} element={element}>
          {children}
        </ListItem>
      );
  }

  return <React.Fragment />;
}

export default SlateElement;
