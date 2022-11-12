import * as React from "react";

import { Flubber } from "../../../components";
import { theme } from "../../../styles";

import { WorksheetCell } from "../worksheetsTypes";

import { WorksheetCellProps } from "./worksheetCellTypes";

export const SPREADSHEET_CELL_WIDTH = theme.spacing * 28;
export const SPREADSHEET_CELL_HEIGHT = theme.spacing * 8;

function WorksheetCell({
  children,
  defaultWidth = SPREADSHEET_CELL_WIDTH,
  defaultHeight = SPREADSHEET_CELL_HEIGHT,
  ...cell
}: WorksheetCellProps) {
  const { row: height, column: width } = cell;
  // const width = column
  // const height = row

  return (
    <Flubber
      defaultWidth={defaultWidth}
      defaultHeight={defaultHeight}
      width={width}
      height={height}
    >
      {children}
    </Flubber>
  );
}

export default WorksheetCell;
