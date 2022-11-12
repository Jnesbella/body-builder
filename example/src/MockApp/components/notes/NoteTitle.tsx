import * as React from "react";
import { RichTextEditor } from "@jnesbella/body-builder";

import { Note } from "../../types";

export interface NoteTitleProps {
  note: Note;
}

function NoteTitle({ note }: NoteTitleProps) {
  const { content } = note;

  return <RichTextEditor value={content} disabled />;
}

export default NoteTitle;
