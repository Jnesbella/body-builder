import * as React from "react";
import { ReactEditor, useSlate } from "slate-react";
import styled from "styled-components";
import * as Icons from "react-bootstrap-icons";
import { isNumber, last } from "lodash";
import { Transforms } from "slate";

import {
  Icon,
  IconButton,
  Layout,
  spacing,
  SpacingProps,
} from "../../../components";
import { ListItemElement } from "../../../slateTypings";
import { theme } from "../../../styles";

import { Editor, Element } from "../customSlate";

import FormatElementText from "./FormatElementText";
import { SlateElementProps } from "./slateElementTypes";

const ListContainer = styled.div.attrs({ spacingSize: [0, 0.5] })<SpacingProps>`
  ${spacing};
`;

type ListElementProps = SlateElementProps["attributes"] & {
  children: SlateElementProps["children"];
};

export const ListElement = React.forwardRef<any, ListElementProps>(
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

const ListItemIconWrapper = styled.span<SpacingProps>`
  ${spacing};

  min-width: ${theme.spacing * (theme.spacing - 1)}px;
  display: flex;
  justify-content: right;
`;

export const ListItem = React.forwardRef<any, ListItemProps>(
  ({ children, element, ...rest }, ref) => {
    const editor = useSlate();

    const path = ReactEditor.findPath(editor, element);
    const index = last(path);
    const [firstChild] = element.children || [];
    const { type: formatType } = firstChild || {};

    const toggleChecked = () => {
      ReactEditor.focus(editor);

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
                focusOn="none"
                focusable={false}
              />
            )}

            {element.listType === "bulleted-list" && <Icon icon={Icons.Dot} />}

            {element.listType === "numbered-list" && isNumber(index) && (
              <React.Fragment>{index + 1}.</React.Fragment>
            )}
          </FormatElementText>
        </ListItemIconWrapper>

        {children}
      </Layout.Row>
    );
  }
);
