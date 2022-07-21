import * as React from "react";
import { ReactEditor, RenderElementProps, useSlate } from "slate-react";
import styled, { css } from "styled-components";
import * as Icons from "react-bootstrap-icons";

import {
  FontSize,
  Icon,
  IconButton,
  Layout,
  spacing,
  Text,
  paragraph,
  heading,
  subheading,
  caption,
  label,
  Space,
} from "../../../components";
import { ListItemElement } from "../../../typings-slate";
import { log } from "../../../utils";
import { Editor } from "./slate";
import { Element, Node, Transforms } from "slate";
import { isNumber, last } from "lodash";
import { theme } from "../../../styles";
import SlateFormatInput from "./SlateFormatInput";
import { Pressable } from "../../Pressable";

export interface SlateElementProps extends RenderElementProps {}

// const ElementContainer =

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
        {/* <Layout.Column spacingSize={[0, 1]}> */}
        {/* <Text.Label>Tasks</Text.Label> */}

        {children}
        {/* </Layout.Column> */}
      </ListContainer>
    );
  }
);

type ListItemProps = SlateElementProps["attributes"] & {
  element: ListItemElement;
  children: SlateElementProps["children"];
};

const ListItemContainer = styled.div``;

const ListItemWrapper = styled.span<{ index?: number }>`
  :before {
    content: "${(props) => (props.index ? `${props.index}.` : "")}";
  }
`;

const ListItemIconWrapper = styled.span.attrs({
  contentEditable: false,
  spacingSize: [1, 0],
})`
  ${spacing};

  min-width: ${theme.spacing * (theme.spacing - 1)}px;
  display: flex;
  align-items: center;
  justify-content: right;
`;

const ListItem = React.forwardRef<any, ListItemProps>(
  ({ children, element, ...rest }, ref) => {
    const editor = useSlate();

    const path = ReactEditor.findPath(editor, element);
    const index = last(path);

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
      <ListItemContainer>
        <Layout.Row alignItems="center">
          <ListItemIconWrapper>
            {element.listType === "task-list" && (
              <IconButton
                icon={element.checked ? Icons.CheckCircle : Icons.Circle}
                onPress={toggleChecked}
              />
            )}

            {element.listType === "bullet-list" && <Icon icon={Icons.Dot} />}

            {element.listType === "number-list" && isNumber(index) && (
              <React.Fragment>{index + 1}.</React.Fragment>
            )}
          </ListItemIconWrapper>

          <ListItemWrapper
            {...rest}
            ref={ref}
            // index={
            //   element.listType === "number-list" && isNumber(index)
            //     ? index + 1
            //     : undefined
            // }
          >
            {children}
          </ListItemWrapper>
        </Layout.Row>
      </ListItemContainer>
    );
  }
);

function SlateElement(props: SlateElementProps) {
  const { children, element, attributes } = props;

  const editor = useSlate();
  const path = ReactEditor.findPath(editor, element);

  let content = <Paragraph {...attributes}>{children}</Paragraph>;
  let spacingSize = 0.5;

  // log("SlateElement", { attributes, element });

  switch (element.type) {
    // case "block-quote":
    //   return <blockquote {...attributes}>{children}</blockquote>;

    case "bullet-list":
      content = <BulletList {...attributes}>{children}</BulletList>;
      break;

    case "number-list":
      content = <NumberList {...attributes}>{children}</NumberList>;
      break;

    case "task-list":
      content = <TaskList {...attributes}>{children}</TaskList>;
      break;

    case "heading":
      content = <Heading {...attributes}>{children}</Heading>;
      spacingSize = 1;
      break;

    case "subheading":
      content = <Subheading {...attributes}>{children}</Subheading>;
      break;

    case "caption":
      content = <Caption {...attributes}>{children}</Caption>;
      break;

    case "label":
      content = <Label {...attributes}>{children}</Label>;
      break;

    case "list-item":
      content = (
        <ListItem {...attributes} element={element}>
          {children}
        </ListItem>
      );
      break;
  }

  return (
    <Pressable>
      {({ hovered }) => (
        <Layout.Row>
          <div contentEditable={false}>
            <Layout.Column>
              <Space spacingSize={spacingSize} />

              <Layout.Row>
                <SlateFormatInput hovered={hovered} />

                <Space />
              </Layout.Row>
            </Layout.Column>
          </div>

          {content}
        </Layout.Row>
      )}
    </Pressable>
  );
}

export default SlateElement;
