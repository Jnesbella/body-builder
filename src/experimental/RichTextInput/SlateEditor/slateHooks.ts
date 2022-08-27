import * as React from "react";
import { Editor as DefaultEditor } from "slate";

import { FormatElement } from "../../../typings-slate";
import { log } from "../../../utils";

import { Editor, Element } from "./customSlate";

export function useSetFormatElement({ editor }: { editor?: DefaultEditor }) {
  const setFormatElement = React.useCallback(
    ({ type }: Partial<FormatElement>) => {
      if (type && editor) {
        Editor.setFormatElement(editor, { type });
      }
    },
    [editor]
  );

  return setFormatElement;
}

export function useActiveFormat({
  editor,
}: {
  editor?: DefaultEditor;
} = {}) {
  const activeFormatType: FormatElement["type"] | undefined = (() => {
    if (editor) {
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
    }
  })();

  return activeFormatType;
}
