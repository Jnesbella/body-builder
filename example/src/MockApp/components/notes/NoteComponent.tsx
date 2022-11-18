import * as React from "react";
import {
  Text,
  Pressable,
  RichTextEditor,
  utcStringToDate,
  Layout,
  Button,
  Space,
  Surface,
  theme,
  bordered,
  rounded,
  spacing,
  Bordered,
  Rounded,
  Effect,
} from "@jnesbella/body-builder";
import styled from "styled-components/native";

import { Note } from "../../types";

import NoteActions, { NoteActionsProps } from "./NoteActions";

import NoteLayout from "./NoteLayout";
import NoteEditor from "./NoteEditor";

const NoteActionsWrapper = styled(Surface)<Bordered & Rounded>`
  ${rounded({ roundness: theme.spacing * 2 })};
  ${spacing({ spacingSize: 0.5 })};
`;

export interface NoteComponentProps {
  note: Note;
}

function NoteComponent({ note }: NoteComponentProps) {
  const [isEditing, setIsEditing] = React.useState(false);

  const onEditStart = () => setIsEditing(true);

  const onEditEnd = () => setIsEditing(false);

  const createdAt: Date = utcStringToDate(note.createdAt);

  const formattedCreatedAt = `${createdAt.getHours()}:${String(
    createdAt.getMinutes()
  ).padStart(2, "0")}`;

  return (
    <Pressable fullWidth>
      {(pressableProps) => (
        <NoteLayout
          {...pressableProps}
          isEditing={isEditing}
          note={note}
          title={<Text.Caption>{formattedCreatedAt}</Text.Caption>}
          // actions={<NoteActions note={note} onPressEdit={onEditStart} />}
          // tags={<NoteTags note={note} />}
          content={
            <NoteEditor
              note={note}
              disabled={!isEditing}
              toolbarEnd={
                // <Effect.FadeIn
                //   fadeIn={pressableProps.hovered}
                //   fadeOut={!pressableProps.hovered}
                // >
                <Layout.Row>
                  <Layout.Box greedy />

                  <NoteActionsWrapper>
                    <NoteActions note={note} onPressEdit={onEditStart} />
                  </NoteActionsWrapper>
                </Layout.Row>
                // </Effect.FadeIn>
              }
              footerEnd={
                isEditing && (
                  <Layout.Row>
                    <Button title="Cancel" onPress={onEditEnd} size="small" />

                    <Space />

                    <Button
                      title="Save"
                      size="small"
                      color="primary"
                      mode="contained"
                    />
                  </Layout.Row>
                )
              }
            />
          }
        />
      )}
    </Pressable>
  );
}

export default NoteComponent;
