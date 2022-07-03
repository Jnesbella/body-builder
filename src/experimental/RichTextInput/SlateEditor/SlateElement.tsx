import * as React from "react";
import { RenderElementProps } from "slate-react";
import styled, { css } from "styled-components";
import * as Icons from "react-bootstrap-icons";

import { FontSize, Icon, Layout, Text } from "../../../components";
import { ListType } from "../../../typings-slate";
import { log } from "../../../utils";

export interface SlateElementProps extends RenderElementProps {}

const text = css`
  font-size: ${FontSize.Normal}px;
`;

const Paragraph = styled.p`
  ${text};
`;

type ButtetListProps = SlateElementProps["attributes"] & {
  children: SlateElementProps["children"];
};

const BulletList = React.forwardRef<any, ButtetListProps>(
  ({ children }, ref) => {
    return <ul ref={ref}>{children}</ul>;
  }
);

type NumberListProps = SlateElementProps["attributes"] & {
  children: SlateElementProps["children"];
};

const NumberList = React.forwardRef<any, NumberListProps>(
  ({ children }, ref) => {
    return <ol ref={ref}>{children}</ol>;
  }
);

type TaskListProps = SlateElementProps["attributes"] & {
  children: SlateElementProps["children"];
};

const TaskListContainer = styled.div`
  // border: 2px solid red;
  // margin: 2px;
`;

const TaskList = React.forwardRef<any, TaskListProps>(({ children }, ref) => {
  return (
    <TaskListContainer ref={ref}>
      <Layout.Column spacingSize={[0, 1]}>
        {/* <Text.Label>Tasks</Text.Label> */}

        {children}
      </Layout.Column>
    </TaskListContainer>
  );
});

type ListItemProps = SlateElementProps["attributes"] & {
  listType?: ListType;
  children: SlateElementProps["children"];
};

const ListItemContainer = styled.div`
  // border: 2px solid blue;
  // margin: 2px;
`;

const ListItem = React.forwardRef<any, ListItemProps>(
  ({ children, listType }, ref) => {
    return (
      <ListItemContainer ref={ref}>
        <Layout.Row alignItems="center">
          <Layout.Box spacingSize={[0.5, 0]}>
            {listType === "task-list" && <Icon icon={Icons.Square} />}
          </Layout.Box>

          {children}
        </Layout.Row>
      </ListItemContainer>
    );
  }
);

function SlateElement(props: SlateElementProps) {
  const { children, element, attributes } = props;

  log("SlateElement", { attributes, element });

  switch (element.type) {
    // case "block-quote":
    //   return <blockquote {...attributes}>{children}</blockquote>;

    case "bullet-list":
      return <BulletList {...attributes}>{children}</BulletList>;

    case "number-list":
      return <NumberList {...attributes}>{children}</NumberList>;

    case "task-list":
      return <TaskList {...attributes}>{children}</TaskList>;

    // case "heading":
    //   return <h1 {...attributes}>{children}</h1>;

    case "list-item":
      return (
        <ListItem {...attributes} listType={element.listType}>
          {children}
        </ListItem>
      );

    default:
      return <Paragraph {...attributes}>{children}</Paragraph>;
  }
}

export default SlateElement;
