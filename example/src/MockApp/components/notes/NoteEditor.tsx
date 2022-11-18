import * as React from "react";
import {
  Layout,
  Surface,
  IconButton,
  RichTextEditor,
  RichTextEditorElement,
  useOnValueChange,
  rounded,
  bordered,
  Rounded,
  Bordered,
  RichTextEditorProps,
  useSetRef,
  theme,
} from "@jnesbella/body-builder";
import styled from "styled-components/native";

import { useSelectedChannelId, useTagIdsFromSearch } from "../../hooks";
import { Note, Tag } from "../../types";

import NoteTagsInput from "../NoteTagsInput";

const NoteEditorContainer = styled(Surface)<Bordered & Rounded>`
  ${rounded};
  ${bordered};
`;

export interface NoteEditorElement {
  reset: () => void;
  getValue: () => Partial<Note>;
}

export interface NoteEditorProps extends Omit<RichTextEditorProps, "below"> {
  elevation?: number;
  footerEnd?: React.ReactNode;
  note?: Note;
  toolbarEnd?: React.ReactNode;
}

const NoteEditor = React.forwardRef<NoteEditorElement, NoteEditorProps>(
  (
    { elevation, toolbarEnd, footerEnd, note, disabled: isDisabled, ...props },
    ref
  ) => {
    const defaultTagIds = useTagIdsFromSearch();

    const [tagIds, setTagIds] = React.useState<Tag["id"][]>(
      note?.tagIds || defaultTagIds
    );

    const selectedChannelId = useSelectedChannelId();

    useOnValueChange(selectedChannelId, () => {
      setTagIds(defaultTagIds);
    });

    const editorRef = React.useRef<RichTextEditorElement>(null);

    const reset = () => {
      editorRef.current?.clear();
      setTagIds(defaultTagIds);
    };

    const getValue = () => ({
      content: editorRef.current?.editor?.children,
      tagIds,
    });

    const element: NoteEditorElement = {
      reset,
      getValue,
    };

    useSetRef(ref, element);

    return (
      <NoteEditorContainer
        elevation={elevation}
        borderColor={
          isDisabled ? theme.colors.transparent : theme.colors.backgroundDivider
        }
        background={
          isDisabled ? theme.colors.transparent : theme.colors.background
        }
      >
        <RichTextEditor
          {...props}
          ref={editorRef}
          value={note?.content}
          placeholder="Jot something down"
          above={(!isDisabled && <RichTextEditor.Toolbar />) || toolbarEnd}
          disabled={isDisabled}
        />

        <Layout.Row justifyContent="space-between" fullWidth spacingSize={1}>
          <NoteTagsInput
            value={tagIds}
            onChange={setTagIds}
            disabled={isDisabled}
          />

          {footerEnd}
        </Layout.Row>
      </NoteEditorContainer>
    );
  }
);

export default NoteEditor;
