import * as React from "react";
import {
  Text,
  Pressable,
  RichTextEditor,
  utcStringToDate,
} from "@jnesbella/body-builder";

import { Note } from "../../../types";

import NoteActions from "../NoteActions";
import NoteTags from "../NoteTags";

import NoteLayout from "./NoteLayout";

function NoteReader({ note }: { note: Note }) {
  const createdAt: Date = utcStringToDate(note.createdAt);

  return (
    <Pressable fullWidth>
      {(pressableProps) => (
        <NoteLayout
          {...pressableProps}
          note={note}
          title={
            <Text.Caption>
              {`${createdAt.getHours()}:${String(
                createdAt.getMinutes()
              ).padStart(2, "0")}`}
            </Text.Caption>
          }
          actions={<NoteActions note={note} />}
          tags={<NoteTags note={note} />}
          content={
            <RichTextEditor
              placeholder="Jot something down"
              value={note.content}
              disabled
            />
          }
        />
      )}
    </Pressable>
  );
}

export default NoteReader;
