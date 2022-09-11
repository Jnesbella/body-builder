import * as React from "react";

import { useWorksheetState } from "./WorksheetContext";
import {
  WorksheetCell,
  WorksheetColumn,
  WorksheetRow,
} from "./worksheetsTypes";
import {
  isRowSelected,
  isColumnSelected,
  isCellSelected,
} from "./worksheetsUtils";

function useIsRowSelected(row: WorksheetRow) {
  const selection = useWorksheetState((state) => state.sheet?.selection);

  return !!selection && isRowSelected(selection, row);
}

function useIsColumnSelected(column: WorksheetColumn) {
  const selection = useWorksheetState((state) => state.sheet?.selection);

  return !!selection && isColumnSelected(selection, column);
}

function useIsCellSelected(cell: WorksheetCell) {
  const selection = useWorksheetState((state) => state.sheet?.selection);

  return !!selection && isCellSelected(selection, cell);
}

export default {
  Row: useIsRowSelected,
  Column: useIsColumnSelected,
  Cell: useIsCellSelected,
};
