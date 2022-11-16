import * as React from "react";
import {
  Layout,
  Surface,
  theme,
  PressableProviderElement,
  background,
  bordered,
  rounded,
  spacing,
  Bordered,
  Rounded,
} from "@jnesbella/body-builder";
import styled from "styled-components/native";

import { Note } from "../../types";

const NoteActionsWrapper = styled(Surface)<Bordered & Rounded>`
  ${bordered};
  ${rounded};
  ${spacing({ spacingSize: 0.5 })};

  position: absolute;
  top: -${theme.spacing * 2}px;
  right: ${theme.spacing * 2}px;
`;

const NoteLayoutContainer = styled(Surface).attrs({
  fullWidth: true,
})<PressableProviderElement & { note: Note }>`
  position: relative;

  ${(props) =>
    background({
      background: props.hovered
        ? theme.colors.backgroundInfo
        : props.note.pinned
        ? theme.colors.background // theme.colors.primaryLight
        : theme.colors.background,
    })};
`;

export interface NoteLayoutProps extends PressableProviderElement {
  title?: React.ReactNode;
  content?: React.ReactNode;
  actions?: React.ReactNode;
  tags?: React.ReactNode;
  note: Note;
  isEditing?: boolean;
}

function NoteLayout({
  content,
  actions,
  title,
  tags,
  note,
  isEditing,
  ...pressableProps
}: NoteLayoutProps) {
  return (
    <NoteLayoutContainer {...pressableProps} note={note}>
      <Layout.Column spacingSize={[2, 1]}>
        <Layout.Row spacingSize={[1, 0]} alignItems="baseline">
          {title}
        </Layout.Row>

        {content}

        <Layout.Box
          style={{
            opacity: pressableProps.hovered ? 1 : 0,
          }}
          spacingSize={[1, 0]}
        >
          {tags}
        </Layout.Box>

        {pressableProps.hovered && !isEditing && (
          <NoteActionsWrapper>{actions}</NoteActionsWrapper>
        )}
      </Layout.Column>
    </NoteLayoutContainer>
  );
}

export default NoteLayout;
