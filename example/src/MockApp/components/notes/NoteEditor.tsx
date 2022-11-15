import * as React from "react";
import {
  Layout,
  Surface,
  IconButton,
  Space,
  RichTextEditor,
  RichTextEditorElement,
  useOnValueChange,
  Info,
  rounded,
  bordered,
  Rounded,
  Bordered,
  elevation,
} from "@jnesbella/body-builder";
import * as Icons from "react-bootstrap-icons";

import {
  useCreateNote,
  useSelectedChannelId,
  useTagIdsFromSearch,
} from "../../hooks";
import { Tag } from "../../types";

import NoteTagsInput from "../NoteTagsInput";
import styled from "styled-components/native";

const NoteEditorWrapper = styled(Surface)<Bordered & Rounded>`
  ${rounded};
  ${bordered};
`;

function NoteEditor() {
  const [tagIds, setTagIds] = React.useState<Tag["id"][]>([]);

  const ref = React.useRef<RichTextEditorElement>(null);

  const defaultTagIds = useTagIdsFromSearch();

  const reset = () => {
    ref.current?.clear();
    setTagIds(defaultTagIds);
  };

  const { create: createNote, isCreating } = useCreateNote({
    onSuccess: reset,
  });

  const selectedChannelId = useSelectedChannelId();

  useOnValueChange(selectedChannelId, () => {
    setTagIds(defaultTagIds);
  });

  const doCreate = () => {
    createNote({
      content: ref.current?.editor?.children,
      tagIds,
    });
  };

  const [elevation, setElevation] = React.useState(0);

  return (
    <Surface fullWidth spacingSize={[3, 1]}>
      <NoteEditorWrapper elevation={elevation}>
        <RichTextEditor
          ref={ref}
          placeholder="Jot something down"
          disabled={isCreating}
          above={<RichTextEditor.Toolbar />}
          onFocus={() => setElevation(1)}
          onBlur={() => setElevation(0)}
        />

        <Layout.Row justifyContent="space-between" fullWidth spacingSize={1}>
          <NoteTagsInput value={tagIds} onChange={setTagIds} />

          <IconButton
            icon={Icons.Send}
            onPress={doCreate}
            focusOn="none"
            focusable={false}
            size="small"
          />
        </Layout.Row>
      </NoteEditorWrapper>

      <Space spacingSize={2} />
    </Surface>
  );
}

export default NoteEditor;
