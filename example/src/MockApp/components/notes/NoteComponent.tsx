import * as React from "react";
import {
  Text,
  Pressable,
  RichTextEditor,
  utcStringToDate,
  Layout,
  Button,
  Space,
} from "@jnesbella/body-builder";

import { Note } from "../../types";

import NoteActions, { NoteActionsProps } from "./NoteActions";
import NoteTags from "./NoteTags";

import NoteLayout from "./NoteLayout";
import NoteEditor from "./NoteEditor";

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
          actions={<NoteActions note={note} onPressEdit={onEditStart} />}
          // tags={<NoteTags note={note} />}
          content={
            // <RichTextEditor
            //   placeholder="Jot something down"
            //   value={note.content}
            //   disabled={!isEditing}
            // />

            <NoteEditor
              note={note}
              disabled={!isEditing}
              end={
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
