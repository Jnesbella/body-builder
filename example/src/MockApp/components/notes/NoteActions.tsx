import * as React from "react";
import {
  Layout,
  IconButton as DefaultIconButton,
  IconButtonProps,
  Effect,
  Space as DefaultSpace,
} from "@jnesbella/body-builder";
import * as Icons from "react-bootstrap-icons";

import { useUpdateNote } from "../../hooks";
import { Note } from "../../types";

export interface NoteActionsProps {
  note: Note;
  onPressEdit?: () => void;
  hovered?: boolean;
}

function NoteActions({
  note,
  onPressEdit,
  hovered: isHovered,
}: NoteActionsProps) {
  const { update: updateNote } = useUpdateNote();

  const IconButton = React.useCallback(
    (iconButtonProps: IconButtonProps & { visible?: boolean }) => {
      const showIcon = isHovered || iconButtonProps.visible || false;

      return (
        <Effect.FadeIn
          fadeIn={showIcon}
          fadeOut={!showIcon}
          fadeInOnMount={false}
          duration={0}
        >
          <DefaultIconButton
            {...iconButtonProps}
            size="small"
            focusOn="none"
            focusable={false}
          />
        </Effect.FadeIn>
      );
    },
    [isHovered]
  );

  const Space = () => <DefaultSpace spacingSize={0.5} />;

  return (
    <Layout.Row>
      <IconButton icon={Icons.Pencil} onPress={onPressEdit} />

      <Space />

      <IconButton icon={Icons.Trash} />

      <Space />

      <IconButton icon={Icons.ChatRightText} />

      <Space />

      <IconButton
        icon={note.pinned ? Icons.BookmarkFill : Icons.Bookmark}
        visible={note.pinned}
        onPress={() => {
          updateNote({
            id: note.id,
            pinned: !note.pinned,
          });
        }}
      />

      <Space />

      <IconButton icon={Icons.ThreeDotsVertical} />
    </Layout.Row>
  );
}

export default NoteActions;
