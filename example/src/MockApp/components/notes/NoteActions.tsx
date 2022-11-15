import * as React from "react";
import {
  Layout,
  Surface,
  IconButton,
  theme,
  bordered,
  rounded,
  Bordered,
  Rounded,
  spacing,
} from "@jnesbella/body-builder";
import styled from "styled-components/native";
import * as Icons from "react-bootstrap-icons";

import { useUpdateNote } from "../../hooks";
import { Note } from "../../types";

const NoteElementActionsMenuContainer = styled(Surface)<Bordered & Rounded>`
  ${bordered};
  ${rounded};
  ${spacing({ spacingSize: 0.5 })};

  position: absolute;
  top: -${theme.spacing * 2}px;
  right: ${theme.spacing * 2}px;
`;

function NoteActions({ note }: { note: Note }) {
  const { update: updateNote } = useUpdateNote();

  return (
    <Layout.Row>
      <IconButton
        icon={Icons.Pencil}
        size="small"
        focusOn="none"
        focusable={false}
      />

      <IconButton
        icon={Icons.Trash}
        size="small"
        focusOn="none"
        focusable={false}
      />

      <IconButton
        icon={Icons.ChatRightText}
        size="small"
        focusOn="none"
        focusable={false}
      />

      <IconButton
        icon={note.pinned ? Icons.BookmarkFill : Icons.Bookmark}
        size="small"
        focusOn="none"
        focusable={false}
        onPress={() => {
          updateNote({
            id: note.id,
            pinned: !note.pinned,
          });
        }}
      />

      <IconButton
        icon={Icons.ThreeDotsVertical}
        size="small"
        focusOn="none"
        focusable={false}
      />
    </Layout.Row>
  );
}

export default NoteActions;
