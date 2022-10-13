import { Element } from "slate";
import { FontSize } from "../../../components";

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

export const TEXT_ALIGN_TYPES: FormatElement["textAlign"][] = [
  "left",
  "center",
  "right",
  "justify",
];

export const TEXT_ALIGN_DEFAULT: FormatElement["textAlign"] = "left";

export const FONT_SIZE_DEFAULT = FontSize.Normal;

export const ELEMENT_TAGS = {
  A: () => ({ type: "paragraph" }),
  // A: (el: HTMLElement) => ({ type: "link", url: el.getAttribute("href") }),
  BLOCKQUOTE: () => ({ type: "block-quote" }),
  H1: () => ({ type: "heading" }),
  H2: () => ({ type: "heading" }),
  H3: () => ({ type: "heading" }),
  H4: () => ({ type: "heading" }),
  H5: () => ({ type: "heading" }),
  H6: () => ({ type: "heading" }),
  IMG: (el: HTMLElement) => ({ type: "image", src: el.getAttribute("src") }),
  // IMG: (el: HTMLElement) => ({ type: "image", url: el.getAttribute("src") }),
  LI: (_el: HTMLElement) => ({ type: "list-item" }),
  OL: () => ({ type: "number-list" }),
  P: () => ({ type: "paragraph" }),
  PRE: () => ({ type: "code" }),
  UL: () => ({ type: "bullet-list" }),
};

// COMPAT: `B` is omitted here because Google Docs uses `<b>` in weird ways.
export const TEXT_TAGS = {
  CODE: () => ({ code: true }),
  DEL: () => ({ strikethrough: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  S: () => ({ strikethrough: true }),
  STRONG: () => ({ bold: true }),
  U: () => ({ underline: true }),
};
