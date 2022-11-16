import * as React from "react";
import { Layout, IconButton } from "@jnesbella/body-builder";
import * as Icons from "react-bootstrap-icons";

import { useUpdateNote } from "../../hooks";
import { Note } from "../../types";

export interface NoteActionsProps {
  note: Note;
  onPressEdit?: () => void;
}

function NoteActions({ note, onPressEdit }: NoteActionsProps) {
  const { update: updateNote } = useUpdateNote();

  return (
    <Layout.Row>
      <IconButton
        icon={Icons.Pencil}
        size="small"
        focusOn="none"
        focusable={false}
        onPress={onPressEdit}
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
