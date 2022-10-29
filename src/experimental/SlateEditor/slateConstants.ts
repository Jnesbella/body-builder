import { Element } from "slate";
import * as Icons from "react-bootstrap-icons";
import { Icon } from "react-bootstrap-icons";

import { FontSize } from "../../components";

import {
  MarkType,
  ListElement,
  FormatElement,
  CustomElement,
} from "../../slateTypings";

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
  "numbered-list",
  "bulleted-list",
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
  OL: () => ({ type: "numbered-list" }),
  P: () => ({ type: "paragraph" }),
  PRE: () => ({ type: "code" }),
  UL: () => ({ type: "bulleted-list" }),
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

export const MARK_ICONS: Record<MarkType, Icon> = {
  bold: Icons.TypeBold,
  code: Icons.Code,
  italic: Icons.TypeItalic,
  strikethrough: Icons.TypeStrikethrough,
  underline: Icons.TypeUnderline,
};

export const LIST_BLOCK_ICONS: Record<ListElement["type"], Icon> = {
  "bulleted-list": Icons.ListUl,
  "numbered-list": Icons.ListOl,
  "task-list": Icons.ListCheck,
};

export const BLOCK_ICONS: Partial<Record<CustomElement["type"], Icon>> = {
  ...LIST_BLOCK_ICONS,
  image: Icons.Image,
  link: Icons.Link45deg,
  "block-quote": Icons.BlockquoteLeft,
  code: Icons.CodeSquare,
};

export const MARK_TYPES: MarkType[] = Object.keys(MARK_ICONS) as MarkType[];
