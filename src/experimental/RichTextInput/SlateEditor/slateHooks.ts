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

export function useActiveTextAlign({
  editor,
}: {
  editor?: DefaultEditor;
} = {}) {
  const activeTextAlign: FormatElement["textAlign"] = (() => {
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

      const { textAlign } = (element as FormatElement) || {};

      return textAlign;
    }
  })();

  return activeTextAlign || "left";
}
