// This example is for an Editor with `ReactEditor` and `HistoryEditor`
import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export type MarkType =
  | "bold"
  | "italic"
  | "underline"
  | "code"
  | "strikethrough";

export type MarkRecord = Partial<Record<MarkType, boolean>>;

export type FormattedText = {
  text: string;
} & MarkRecord;

export type CustomText = FormattedText;

export type ParagraphElement = {
  type: "paragraph";
  children: CustomText[];
};

export type HeadingElement = {
  type: "heading";
  children: CustomText[];

  level?: number;
};

export type SubheadingElement = {
  type: "subheading";
  children: CustomText[];
};

export type LabelElement = {
  type: "label";
  children: CustomText[];
};

export type CaptionElement = {
  type: "caption";
  children: CustomText[];
};

export type LinkElement = {
  type: "link";
  children: CustomText[];
  url: string;
};

export type FormatElement = (
  | ParagraphElement
  | HeadingElement
  | SubheadingElement
  | LabelElement
  | CaptionElement
) & {
  textAlign?: "left" | "center" | "right" | "justify";
  fontSize?: number;
};

export type ImageElement = {
  type: "image";
  src: string;
  width?: number;
  children: CustomText[];
};

export type TaskListElement = {
  type: "task-list";
  children: ListItemElement[];
};

export type BulletedListElement = {
  type: "bulleted-list";
  children: ListItemElement[];
};

export type NumberedListElement = {
  type: "numbered-list";
  children: ListItemElement[];
};

export type ListElement =
  | BulletedListElement
  | NumberedListElement
  | TaskListElement;

export type ListItemElement = {
  type: "list-item";
  children: FormatElement[];
  listType?: ListElement["type"];
  checked?: boolean;
};

export type BlockQuoteElement = {
  type: "block-quote";
  children: CustomText[];
};

export type CodeElement = {
  type: "code";
  children: CustomText[];
};

export type CustomElement =
  | FormatElement
  | ListElement
  | ListItemElement
  | BlockQuoteElement
  | CodeElement
  | LinkElement
  | ImageElement;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
