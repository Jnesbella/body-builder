import WorksheetCell from "./WorksheetCell";
import TextInput from "./WorksheetCellTextInput";
import Header from "./WorksheetCellHeader";
import CellContent from "./WorksheetCellContent";

type WorksheetCell = typeof WorksheetCell & {
  TextInput: typeof TextInput;
  Header: typeof Header;
  CellContent: typeof CellContent;
};
(WorksheetCell as WorksheetCell).TextInput = TextInput;
(WorksheetCell as WorksheetCell).Header = Header;
(WorksheetCell as WorksheetCell).CellContent = CellContent;

export * from "./worksheetCellTypes";
export * from "./WorksheetCell";
export * from "./WorksheetCellContent";

export default WorksheetCell as WorksheetCell;
