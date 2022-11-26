import * as React from "react";
import { Element } from "@jnesbella/body-builder";

import { Note } from "../../types";

export interface NoteTitleProps {
  note: Note;
}

function NoteTitle({ note }: NoteTitleProps) {
  const { content } = note;

  const titleElement = content?.find(
    (node) => Element.getText(node).length > 0
  );

  const title = titleElement ? Element.getText(titleElement) : "untitled";

  return <React.Fragment>{title}</React.Fragment>;
}

export default NoteTitle;
