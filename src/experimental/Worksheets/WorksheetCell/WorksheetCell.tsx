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
  const { row, column } = cell;
  const width = React.useMemo(() => ({ name: column }), [column]);
  const height = React.useMemo(() => ({ name: row }), [row]);

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
