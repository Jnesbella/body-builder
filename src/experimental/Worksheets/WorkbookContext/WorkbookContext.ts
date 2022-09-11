import * as React from "react";

import { Workbook, Worksheet } from "../worksheetsTypes";

export interface WorkbookStateContext {
  workbook: Workbook;
}

export const WorkbookStateContext =
  React.createContext<WorkbookStateContext | null>(null);

export interface WorkbookActionsContext {
  setWorkbook: React.Dispatch<React.SetStateAction<Workbook>>;

  setName: (name: Workbook["name"]) => void;

  createWorksheet: (sheet: Worksheet) => void;
  readWorksheet: (query: Partial<Worksheet>) => Worksheet | undefined;
  updateWorksheet: (
    name: Worksheet["name"],
    updates: Partial<Worksheet>
  ) => void;
  deleteWorksheet: (name: Worksheet["name"]) => void;
}

export const WorkbookActionsContext =
  React.createContext<WorkbookActionsContext | null>(null);
