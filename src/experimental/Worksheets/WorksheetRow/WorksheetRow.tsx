import * as React from "react";

import { Layout, Surface } from "../../../components";
import { theme } from "../../../styles";

import { HEADER_ROW } from "../worksheetsConstants";
import SpreadsheetGrip from "../WorksheetGrip";
import { WorksheetCell } from "../worksheetsTypes";
import {
  CellRenderer,
  useWorksheetActions,
  useWorksheetState,
} from "../WorksheetContext";
import Cell from "../WorksheetCell";

export interface WorksheetRowProps {
  row: string;
  renderCell?: CellRenderer;
  defaultHeight?: number;
  defaultWidth?: number;
  rowIndex?: number;
}

function WorksheetRow({
  row,
  renderCell: CellOverride,
  defaultHeight,
  defaultWidth,
  rowIndex,
}: WorksheetRowProps) {
  const isHeader = row === HEADER_ROW;
  const columns = useWorksheetState((state) => state.sheet?.columns);
  const sheet = useWorksheetState((state) => state.sheet?.name);
  const getCellProps = useWorksheetActions((actions) => actions.getCellProps);

  const addRow = useWorksheetActions((actions) => actions.addRow);
  const removeRow = useWorksheetActions((actions) => actions.removeRow);

  const DefaultCell = useWorksheetActions((actions) => actions.renderCell);
  const CellContent = CellOverride || DefaultCell;

  React.useEffect(
    function manageRow() {
      addRow(row);

      return () => {
        removeRow(row);
      };
    },
    [addRow, removeRow, row]
  );

  return (
    <Surface
      background={
        isHeader ? theme.colors.backgroundInfo : theme.colors.transparent
      }
      spacingSize={[0.5, 0]}
      style={
        isHeader && {
          borderBottomWidth: theme.borderThickness,
          borderBottomColor: theme.colors.backgroundInfo,
        }
      }
    >
      <Layout.Row>
        {columns?.map((column, columnIndex) => {
          const isFirstColumn = columnIndex === 0;
          const prevColumn = !isFirstColumn
            ? columns?.[columnIndex - 1]
            : undefined;

          const cell: WorksheetCell = {
            row,
            column,
          };

          const cellProps = getCellProps(column, {
            defaultWidth,
            defaultHeight,
          });

          return (
            <React.Fragment key={sheet + row + column}>
              {prevColumn && (
                <SpreadsheetGrip pushAndPull={[prevColumn, column]} />
              )}

              <Cell
                {...cellProps}
                {...cell}
                columnIndex={columnIndex}
                rowIndex={rowIndex}
              >
                <CellContent
                  {...cell}
                  columnIndex={columnIndex}
                  rowIndex={rowIndex}
                />
              </Cell>
            </React.Fragment>
          );
        })}
      </Layout.Row>
    </Surface>
  );
}

export default WorksheetRow;
