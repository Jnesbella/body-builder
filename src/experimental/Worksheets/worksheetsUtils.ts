import {
  WorksheetCell,
  WorksheetColumn,
  WorksheetRow,
  WorksheetSelection,
  Workbook,
} from "./worksheetsTypes";

export const serializeWorkbook = (_workbook: Workbook) => "";

export const deserializeWorkbook = (_maybeWorkbook: string) => "";

/**
 * selection utils
 */

export const isRowSelected = (
  selection: WorksheetSelection,
  { row }: WorksheetRow
) => {
  return selection?.type === "row" && selection?.row === row;
};

export const isColumnSelected = (
  selection: WorksheetSelection,
  { column }: WorksheetColumn
) => {
  return selection?.type === "column" && selection?.column === column;
};

export const isCellSelected = (
  selection: WorksheetSelection,
  { row, column }: WorksheetCell
) => {
  return (
    (selection?.type === "cell" &&
      selection?.column === column &&
      selection?.row === row) ||
    (selection?.type === "column" && selection?.column === column) ||
    (selection?.type === "row" && selection?.row === row)
  );
};
