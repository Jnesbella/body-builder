import { Worksheet } from "../worksheetsTypes";

export interface WorkbookNodeTitle {
  type: "title";
  sheet: string;
}

export interface WorkbookNodeGrip {
  type: "grip";
  sheet: string;
  rowIndex: number;
}

export interface WorkbookNodeSpace {
  type: "space";
}

export interface WorkbookNodeDefault {
  type: "default";
  sheet: string;
  rowIndex: number;
}

export type WorkbookNode =
  | WorkbookNodeGrip
  | WorkbookNodeDefault
  | WorkbookNodeTitle
  | WorkbookNodeSpace;
