import * as React from "react";
import {
  Layout,
  Surface,
  IconButton,
  Space,
  RichTextEditor,
  RichTextEditorElement,
} from "@jnesbella/body-builder";
import * as Icons from "react-bootstrap-icons";

import {
  useCreateNote,
  useSelectedChannelId,
  useTagIdsFromSearch,
} from "../../hooks";
import { Tag } from "../../types";

import NoteTagsInput from "../NoteTagsInput";

function NoteEditor() {
  const [tagIds, setTagIds] = React.useState<Tag["id"][]>([]);

  const ref = React.useRef<RichTextEditorElement>(null);

  const { create: createNote } = useCreateNote({
    onSuccess: () => {
      ref.current?.clear();
    },
  });

  const defaultTagIds = useTagIdsFromSearch();

  const selectedChannelId = useSelectedChannelId();
  const selectedChannelIdCache = React.useRef(selectedChannelId);

  const selectedChannelIdChanged =
    selectedChannelId !== selectedChannelIdCache.current;

  React.useEffect(
    function cacheSelectedChannelId() {
      selectedChannelIdCache.current = selectedChannelId;
    },
    [selectedChannelId]
  );

  React.useEffect(
    function setDefaultTagIds() {
      if (selectedChannelIdChanged) {
        setTagIds(defaultTagIds);
      }
    },
    [defaultTagIds, selectedChannelIdChanged]
  );

  const doCreate = () => {
    createNote({
      content: ref.current?.editor?.children,
    });
  };

  return (
    <Surface fullWidth spacingSize={[3, 1]}>
      <Layout.Column>
        <RichTextEditor ref={ref} placeholder="Jot something down" />

        <Space />

        <Layout.Row justifyContent="space-between" fullWidth>
          <NoteTagsInput value={tagIds} onChange={setTagIds} />

          <IconButton
            icon={Icons.Send}
            onPress={doCreate}
            focusOn="none"
            focusable={false}
          />
        </Layout.Row>
      </Layout.Column>
    </Surface>
  );
}

export default NoteEditor;
