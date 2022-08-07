import { Descendant } from "slate";

export interface PaperlessPage {
  id: string;
  title: string;
  content?: Descendant[];
  index?: number;
}
