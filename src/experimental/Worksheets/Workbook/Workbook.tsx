import * as React from "react";

import { Workbook as WorkbookType } from "../worksheetsTypes";
import WorkbookContextProvider from "../WorkbookContext/WorkbookContextProvider";

export interface WorkbookProps {
  name?: WorkbookType["name"];
  defaultWorkbook?: WorkbookType;
  children?: React.ReactNode;
}

export interface WorkbookElement {}

const Workbook = React.forwardRef<WorkbookElement, WorkbookProps>(
  (
    { defaultWorkbook: defaultWorkbookProp, name = "untitled", children },
    _ref
  ) => {
    const defaultWorkbook: WorkbookType = defaultWorkbookProp || {
      name,
      sheets: [],
    };

    return (
      <WorkbookContextProvider defaultWorkbook={defaultWorkbook}>
        {children}
      </WorkbookContextProvider>
    );
  }
);

export default Workbook;
