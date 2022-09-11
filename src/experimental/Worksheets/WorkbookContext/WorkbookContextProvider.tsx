import * as React from "react";

import { Worksheet, Workbook } from "../worksheetsTypes";

import {
  WorkbookActionsContext,
  WorkbookStateContext,
} from "./WorkbookContext";

export interface WorkbookContextProviderProps {
  children?: React.ReactNode;
  defaultWorkbook: Workbook;
}

function WorkbookContextProvider({
  children,
  defaultWorkbook,
}: WorkbookContextProviderProps) {
  const [workbook, setWorkbook] = React.useState<Workbook>(defaultWorkbook);

  const setName = React.useCallback((name: string) => {
    setWorkbook((prevWorkbook) => {
      return {
        ...prevWorkbook,
        name,
      };
    });
  }, []);

  const readWorksheet = React.useCallback(
    (query: Partial<Worksheet>) => {
      return workbook.sheets.find((sheet) => sheet.name === query.name);
    },
    [workbook]
  );

  const createWorksheet = React.useCallback(
    (sheet: Worksheet) => {
      const existingSheet = readWorksheet(sheet);
      if (!existingSheet) {
        setWorkbook((prevWorkbook) => {
          return {
            ...prevWorkbook,
            sheets: [...prevWorkbook.sheets, sheet],
          };
        });
      }

      return sheet;
    },
    [readWorksheet]
  );

  const readOrCreateSheet = React.useCallback(
    (query: Partial<Worksheet>): Worksheet => {
      const maybeSheet = readWorksheet(query);
      if (maybeSheet) {
        return maybeSheet;
      }

      return createWorksheet({
        name: "",
        columns: [],
        rows: [],
        ...query,
      });
    },
    [createWorksheet, readWorksheet]
  );

  const updateWorksheet = React.useCallback(
    (name: Worksheet["name"], updates: Partial<Worksheet>) => {
      setWorkbook((prevWorkbook) => {
        return {
          ...prevWorkbook,
          sheets: prevWorkbook.sheets.map((sheet) =>
            sheet.name === name ? { ...sheet, ...updates } : sheet
          ),
        };
      });
    },
    []
  );

  const deleteWorksheet = React.useCallback((name: Worksheet["name"]) => {
    setWorkbook((prevWorkbook) => {
      return {
        ...prevWorkbook,
        sheets: prevWorkbook.sheets.filter((sheet) => sheet.name !== name),
      };
    });
  }, []);

  return (
    <WorkbookStateContext.Provider value={{ workbook }}>
      <WorkbookActionsContext.Provider
        value={{
          setWorkbook,
          setName,
          createWorksheet,
          readWorksheet: readOrCreateSheet,
          updateWorksheet,
          deleteWorksheet,
        }}
      >
        {children}
      </WorkbookActionsContext.Provider>
    </WorkbookStateContext.Provider>
  );
}

export default WorkbookContextProvider;
