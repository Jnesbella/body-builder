import * as React from "react";

import { WorksheetCellProps } from "../WorksheetCell";
import { WorksheetCell, Worksheet } from "../worksheetsTypes";

export interface SpreadsheetStateContext {
  sheet?: Worksheet;
}

export type CellRenderer = (cell: WorksheetCellProps) => JSX.Element;

export interface SpreadsheetActionsContext {
  addRow: (row: string) => void;
  removeRow: (row: string) => void;

  addColumn: (
    column: string,
    cellProps?: {
      defaultWidth?: WorksheetCellProps["defaultWidth"];
      defaultHeight?: WorksheetCellProps["defaultHeight"];
    }
  ) => void;
  removeColumn: (column: string) => void;

  onSelectColumn: (column: string) => void;
  onSelectRow: (row: string) => void;
  onSelectCell: (row: string, column: string) => void;

  onClearSelection: () => void;

  onRenderColumn: (column: string, renderCell?: CellRenderer) => void;
  renderCell: (cell: WorksheetCell) => JSX.Element;

  getCellProps: (
    column: string,
    cellProps?: {
      defaultWidth?: WorksheetCellProps["defaultWidth"];
      defaultHeight?: WorksheetCellProps["defaultHeight"];
    }
  ) => Partial<WorksheetCellProps>;
}

export const SpreadsheetStateContext =
  React.createContext<SpreadsheetStateContext | null>(null);

export const SpreadsheetActionsContext =
  React.createContext<SpreadsheetActionsContext | null>(null);
