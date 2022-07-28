import * as React from "react";
import { ReactEditor, useSlate } from "slate-react";
import { Editor as DefaultEditor, Transforms } from "slate";

import { FormatElement } from "../../../typings-slate";
import { Editor, Element } from "./slate";
import { isNull } from "lodash";
import { log } from "../../../utils";

export function useSetFormatElement({
  editor: editorProp,
}: {
  editor?: DefaultEditor;
} = {}) {
  const defaultEditor = useSlate();
  const editor = editorProp || defaultEditor;

  const setFormatElement = React.useCallback(
    ({ type }: Partial<FormatElement>) => {
      if (type) {
        Editor.setFormatElement(editor, { type });
      }
    },
    [editor]
  );

  return setFormatElement;
}

export function useActiveFormat({
  editor: editorProp,
}: {
  editor?: DefaultEditor;
} = {}) {
  const defaultEditor = useSlate();
  const editor = editorProp || defaultEditor;

  const activeFormatType: FormatElement["type"] | undefined = (() => {
    const [match] =
      Editor.nodes(editor, {
        match: (node) =>
          !Editor.isEditor(node) &&
          Element.isElement(node) &&
          Element.isFormatElement(node),
        mode: "lowest",
      }) || [];
    const [element] = match || [];

    const { type } = (element as FormatElement) || {};

    return type ? type : undefined;
  })();

  return activeFormatType;
}
