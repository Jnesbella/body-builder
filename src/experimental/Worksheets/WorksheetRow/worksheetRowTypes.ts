import { WorksheetCellProps } from "../WorksheetCell";
import { WorksheetRow } from "../worksheetsTypes";

export interface WorksheetRowProps extends WorksheetRow {
  defaultWidth?: number;
  defaultHeight?: number;
  renderCell?: (props: WorksheetCellProps) => JSX.Element;
}
