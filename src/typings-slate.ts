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

export type FormattedText = {
  text: string;
  // bold?: boolean;
  // code?: boolean;
  // italic?: boolean;
  // underline?: boolean;
  // strikethrough?: boolean;
} & Partial<Record<MarkType, boolean>>;

export type CustomText = FormattedText;

export type BulletListType = "bullet-list";

export type NumberListType = "number-list";

export type TaskListType = "task-list";

export type ListType = BulletListType | NumberListType | TaskListType;

export type ParagraphElement = {
  type: "paragraph";
  children: CustomText[];
};

export type HeadingElement = {
  type: "heading";
  children: CustomText[];

  level?: number;
};

export type LinkElement = {
  type: "link";
  children: CustomText[];

  url?: string;
};

export type ImageElement = {
  type: "image";

  src?: string;
};

export type ListElement = {
  type: "list-item";
  children: CustomText[];
  listType?: ListType;
};

export type BulletListElement = {
  type: BulletListType;
  children: ListElement[];
};

export type NumberListElement = {
  type: NumberListType;
  children: ListElement[];
};

export type TaskListElement = {
  type: TaskListType;
  children: ListElement[];
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
  | ParagraphElement
  | HeadingElement
  | LinkElement
  | BulletListElement
  | NumberListElement
  | ListElement
  | BlockQuoteElement
  | CodeElement
  | TaskListElement
  | ImageElement;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
