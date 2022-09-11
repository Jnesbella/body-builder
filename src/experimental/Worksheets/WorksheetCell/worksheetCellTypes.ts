import * as React from "react";

import { WorksheetCell } from "../worksheetsTypes";

export interface WorksheetCellProps extends WorksheetCell {
  children?: React.ReactNode;
  defaultHeight?: number;
  defaultWidth?: number;
  rowIndex?: number;
  columnIndex?: number;
}
