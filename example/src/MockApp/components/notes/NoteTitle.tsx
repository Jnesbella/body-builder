import * as React from "react";
import { log, Text, Element, TextProps } from "@jnesbella/body-builder";

import { Note } from "../../types";

export interface NoteTitleProps extends TextProps {
  note: Note;
  renderText?: (props: TextProps) => JSX.Element;
}

function NoteTitle({
  note,
  renderText: RenderText = Text,
  ...rest
}: NoteTitleProps) {
  const { content } = note;

  const titleElement = content?.find(
    (node) => Element.getText(node).length > 0
  );

  const title = titleElement ? Element.getText(titleElement) : "untitled";

  log({ title, titleElement });

  return <RenderText {...rest}>{title}</RenderText>;
}

export default NoteTitle;
