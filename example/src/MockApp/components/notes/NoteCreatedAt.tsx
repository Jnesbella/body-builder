import * as React from "react";
import { Text, utcStringToDate } from "@jnesbella/body-builder";

import { Note } from "../../types";

export interface NoteCreatedAtProps {
  note: Note;
}

function NoteCreatedAt({ note }: NoteCreatedAtProps) {
  const createdAt: Date = utcStringToDate(note.createdAt);

  const formattedCreatedAt = `${createdAt.getHours()}:${String(
    createdAt.getMinutes()
  ).padStart(2, "0")}`;

  return <Text.Caption>{formattedCreatedAt}</Text.Caption>;
}

export default NoteCreatedAt;
