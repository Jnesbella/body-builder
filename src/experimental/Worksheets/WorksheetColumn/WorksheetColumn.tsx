import * as React from "react";

import { CellRenderer, useWorksheetActions } from "../WorksheetContext";

export interface WorksheetColumnProps {
  column: string;
  children?: React.ReactNode;
  renderCell?: CellRenderer;
  defaultWidth?: number;
  defaultHeight?: number;
}

function WorksheetColumn({
  column,
  renderCell,
  children,
  defaultWidth,
  defaultHeight,
}: WorksheetColumnProps) {
  const addColumn = useWorksheetActions((actions) => actions.addColumn);
  const removeColumn = useWorksheetActions((actions) => actions.removeColumn);

  React.useEffect(
    function manageColumn() {
      addColumn(column, {
        defaultWidth,
        defaultHeight,
      });

      // return () => {
      //   removeColumn(column);
      // }
    },
    [addColumn, removeColumn, column, defaultWidth, defaultHeight]
  );

  const onRenderColumn = useWorksheetActions(
    (actions) => actions.onRenderColumn
  );

  React.useEffect(() => {
    onRenderColumn(column, renderCell);
  }, [onRenderColumn, column, renderCell]);

  return <React.Fragment>{children}</React.Fragment>;
}

export default WorksheetColumn;
