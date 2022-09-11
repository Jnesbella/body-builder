import * as React from "react";

import { useWorkbookActions } from "../WorkbookContext";
import { Worksheet as WorksheetType } from "../worksheetsTypes";
import {
  WorksheetContextProvider,
  WorksheetContextProviderElement,
  WorksheetContextProviderProps,
} from "../WorksheetContext";

export type WorksheetElement = WorksheetContextProviderElement;

export interface WorksheetProps {
  name?: WorksheetType["name"];
  children?: React.ReactNode;
  columns?: React.ReactNode;
  rows?: React.ReactNode;
  title?: React.ReactNode;
  onChangeSelection?: WorksheetContextProviderProps["onChangeSelection"];
}

const Worksheet = React.forwardRef<WorksheetElement, WorksheetProps>(
  (
    { name = "untitled", children, rows, columns, title, onChangeSelection },
    ref
  ) => {
    const createWorksheet = useWorkbookActions(
      (actions) => actions.createWorksheet
    );

    React.useEffect(function createOnMount() {
      createWorksheet({ name, rows: [], columns: [] });
    }, []);

    return (
      <WorksheetContextProvider
        sheet={name}
        ref={ref}
        onChangeSelection={onChangeSelection}
      >
        {title}
        {columns}
        {rows}
        {children}
      </WorksheetContextProvider>
    );
  }
);

export default Worksheet;
