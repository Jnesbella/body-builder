import { Element } from "slate";

import { MarkType, ListType } from "../../../typings-slate";

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

export const LIST_TYPES: ListType[] = [
  "numbered-list",
  "bulleted-list",
  "task-list",
];
