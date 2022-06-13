// This example is for an Editor with `ReactEditor` and `HistoryEditor`
import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export type FormattedText = {
  text: string;
  // bold?: boolean;
  // code?: boolean;
  // italic?: boolean;
  // underline?: boolean;
  // strikethrough?: boolean;
} & Partial<Record<MarkType, boolean>>;

export type CustomText = FormattedText;

export type BulletedListType = "bulleted-list";

export type NumberedListType = "numbered-list";

export type TaskListType = "task-list";

export type ListType = BulletedListType | NumberedListType | TaskListType;

export type MarkType =
  | "bold"
  | "italic"
  | "underline"
  | "code"
  | "strikethrough";

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

export type BulletedListElement = {
  type: BulletedListType;
  children: CustomText[];
};

export type NumberedListElement = {
  type: NumberedListType;
  children: CustomText[];
};

export type ListElement = {
  type: "list-item";
  children: CustomText[];
};

export type BlockQuoteElement = {
  type: "block-quote";
  children: CustomText[];
};

export type CodeElement = {
  type: "code";
  children: CustomText[];
};

export type TaskListElement = {
  type: TaskListType;
  children: CustomText[];
};

export type CustomElement =
  | ParagraphElement
  | HeadingElement
  | LinkElement
  | BulletedListElement
  | NumberedListElement
  | ListElement
  | BlockQuoteElement
  | CodeElement
  | TaskListElement;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
