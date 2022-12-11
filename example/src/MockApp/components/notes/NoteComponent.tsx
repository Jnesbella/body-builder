import * as React from "react";
import {
  Pressable,
  utcStringToDate,
  Layout,
  Button,
  Space,
  Surface,
  theme,
  rounded,
  spacing,
  Bordered,
  Rounded,
  log,
  Effect,
} from "@jnesbella/body-builder";
import styled from "styled-components/native";

import { Note } from "../../types";
import { useUpdateNote } from "../../hooks";

import NoteActions from "./NoteActions";
import NoteLayout from "./NoteLayout";
import NoteEditor, { NoteEditorElement, NoteEditorProps } from "./NoteEditor";
import { isEqual, pick } from "lodash";
import NoteCreatedAt from "./NoteCreatedAt";

const NoteActionsWrapper = styled(Surface).attrs({
  // background: theme.colors.transparent,
})<Bordered & Rounded>`
  ${rounded({ roundness: theme.spacing * 2 })};
  ${spacing({ spacingSize: 0.5 })};
`;

export interface NoteComponentProps {
  note: Note;
  topOffset?: number;
}

function NoteComponent({ note, topOffset: topOffsetProp }: NoteComponentProps) {
  const [isEditing, setIsEditing] = React.useState(false);

  const startEditing = () => setIsEditing(true);

  const endEditing = () => setIsEditing(false);

  const { update } = useUpdateNote({
    onSuccess: endEditing,
  });

  const { id: noteId } = note;

  const noteEditorRef = React.useRef<NoteEditorElement>(null);

  const isSameContent = (content: NoteEditorProps["value"]) => {
    // const same = isEqual(content, note.content);
    // log({ content, noteContent: note.content });
    // return same;
    return isEqual(content, note.content);
  };

  const isSameTags = (tagIds: Note["tagIds"] = []) => {
    const { tagIds: noteTagIds = [] } = note;

    return (
      tagIds.length === noteTagIds.length &&
      tagIds.every((tagId) => noteTagIds.includes(tagId))
    );
  };

  const isSameByKey = {
    content: isSameContent,
    tagIds: isSameTags,
  };

  const updateableKeys: (keyof Note)[] = Object.keys(isSameByKey);

  const hasChanges = (palyoad: Partial<Note>) => {
    return updateableKeys.some((key) => {
      const isSame = isSameByKey[key];

      return !isSame(palyoad[key]);
    });
  };

  const updateNote = (payload: Partial<Note> = {}) => {
    const updates = pick(payload, updateableKeys);

    if (hasChanges(updates)) {
      console.log("update", updates);

      update({
        ...updates,
        id: noteId,
      });
    } else {
      endEditing();
    }
  };

  const handleChange = (nextContent: Note["content"]) => {
    if (!isEditing) {
      // this gets triggered when:
      // - a task is completed/uncompleted
      // - switching from editing to not editing

      updateNote({
        content: nextContent,
      });
    }
  };

  return (
    <Pressable fullWidth>
      {(pressableProps) => (
        <NoteLayout
          {...pressableProps}
          isEditing={isEditing}
          note={note}
          title={<NoteCreatedAt note={note} />}
          // actions={<NoteActions note={note} onPressEdit={startEditing} />}
          // tags={<NoteTags note={note} />}

          content={
            <NoteEditor
              ref={noteEditorRef}
              note={note}
              disabled={!isEditing}
              onChange={handleChange}
              topOffset={topOffsetProp}
              toolbarEnd={
                <Effect.FadeIn
                  fadeIn={!isEditing}
                  fadeOut={isEditing}
                  duration={0}
                >
                  <Layout.Row>
                    <Layout.Box greedy />

                    <NoteActionsWrapper>
                      <NoteActions
                        note={note}
                        onPressEdit={startEditing}
                        hovered={pressableProps.hovered}
                      />
                    </NoteActionsWrapper>
                  </Layout.Row>
                </Effect.FadeIn>
              }
              footerEnd={
                <Effect.FadeIn
                  fadeIn={isEditing}
                  fadeOut={!isEditing}
                  duration={0}
                >
                  <Layout.Row>
                    <Button
                      title="Cancel"
                      onPress={() => {
                        noteEditorRef.current?.setValue(note.content);
                        endEditing();
                      }}
                      size="small"
                    />

                    <Space />

                    <Button
                      title="Save"
                      size="small"
                      color="primary"
                      mode="contained"
                      onPress={() =>
                        updateNote(noteEditorRef.current?.getValue())
                      }
                    />
                  </Layout.Row>
                </Effect.FadeIn>
              }
            />
          }
        />
      )}
    </Pressable>
  );
}

export default NoteComponent;
