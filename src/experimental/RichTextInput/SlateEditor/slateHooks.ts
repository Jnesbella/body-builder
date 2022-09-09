import * as React from "react";
import { Editor as DefaultEditor } from "slate";

import { FormatElement } from "../../../typings-slate";
import { log } from "../../../utils";

import { Editor, Element } from "./customSlate";

export function useSetFormatElement({ editor }: { editor?: DefaultEditor }) {
  const setFormatElement = React.useCallback(
    (
      updates: {
        type?: FormatElement["type"];
        textAlign?: FormatElement["textAlign"];
      } = {}
    ) => {
      if (editor) {
        Editor.setFormatElement(editor, updates);
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
      const matches = Editor.nodes(editor, {
        match: (node) =>
          !Editor.isEditor(node) &&
          Element.isElement(node) &&
          Element.isFormatElement(node),
        // mode: "lowest",
      });

      let type: FormatElement["type"] | undefined;

      for (let match of matches) {
        const [element] = match || [];

        type = type || (element as FormatElement).type;
      }

      return type;
    }
  })();

  return activeFormatType;
}

export function useActiveTextAlign({
  editor,
}: {
  editor?: DefaultEditor;
} = {}) {
  const activeTextAlign: FormatElement["textAlign"] = (() => {
    if (editor) {
      const matches = Editor.nodes(editor, {
        match: (node) =>
          !Editor.isEditor(node) &&
          Element.isElement(node) &&
          Element.isFormatElement(node),
        // mode: "lowest",
      });

      let textAlign: FormatElement["textAlign"] | undefined;

      for (let match of matches) {
        const [element] = match || [];

        textAlign = textAlign || (element as FormatElement).textAlign;
      }

      return textAlign;
    }
  })();

  return activeTextAlign || "left";
}
