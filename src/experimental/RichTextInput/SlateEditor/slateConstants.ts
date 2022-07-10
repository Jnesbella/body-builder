import { Element } from "slate";

import { MarkType, ListElement, FormatElement } from "../../../typings-slate";

export const DEFAULT_VALUE: Element[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

type KeyboardShortcut = string;
export const HOTKEYS: Record<KeyboardShortcut, MarkType> = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

export const LIST_TYPES: ListElement["type"][] = [
  "number-list",
  "bullet-list",
  "task-list",
];

export const FORMAT_TYPES: FormatElement["type"][] = [
  "heading",
  "subheading",
  "label",
  "caption",
  "paragraph",
];
