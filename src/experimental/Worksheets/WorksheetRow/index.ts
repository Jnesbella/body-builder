import { default as WorksheetRow } from "./WorksheetRow";
import { default as Grip } from "./WorksheetRowGrip";

type WorksheetRow = typeof WorksheetRow & { Grip: typeof Grip };
(WorksheetRow as WorksheetRow).Grip = Grip;

export * from "./worksheetRowTypes";

export default WorksheetRow as WorksheetRow;
