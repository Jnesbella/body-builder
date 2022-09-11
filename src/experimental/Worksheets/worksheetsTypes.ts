/**
 * WorksheetAddress
 */

export interface WorksheetAddress {
  type: "sheet";
  sheet: string;
}

export interface WorksheetAddressRow {
  sheet: string;
  type: "row";
  row: string;
}

export interface WorksheetAddressColumn {
  sheet: string;
  type: "column";
  column: string;
}

export interface WorksheetAddressCell {
  sheet: string;
  type: "cell";
  row: string;
  column: string;
}

/**
 * Worksheet
 */

export type WorksheetSelection =
  | WorksheetAddressRow
  | WorksheetAddressColumn
  | WorksheetAddressCell;

export interface Worksheet {
  name: string;
  rows: string[];
  columns: string[];
  selection?: WorksheetSelection;
}

export type WorkbookSelection = WorksheetAddress;

export interface Workbook {
  name: string;
  sheets: Worksheet[];
  selection?: WorkbookSelection;
}

export interface WorksheetRow {
  row: string;
  columns: string[];
}

export interface WorksheetColumn {
  column: string;
  rows: string[];
}

export interface WorksheetCell {
  column: string;
  row: string;
}
