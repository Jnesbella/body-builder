import * as React from "react";
import { get, isEqual } from "lodash";

import { useSetRef } from "../../../hooks";

import DefaultCell, { WorksheetCellProps } from "../WorksheetCell";
import {
  WorksheetCell,
  Worksheet,
  WorksheetSelection,
} from "../worksheetsTypes";
import { useWorkbookActions } from "../WorkbookContext";

import {
  SpreadsheetStateContext,
  SpreadsheetActionsContext,
  CellRenderer,
} from "./WorksheetContext";

export interface WorksheetContextProviderElement
  extends SpreadsheetStateContext,
    SpreadsheetActionsContext {}

export interface WorksheetContextProviderProps {
  sheet: Worksheet["name"];
  children?: React.ReactNode;
  onChangeSelection?: (selection: WorksheetSelection) => void;
}

const WorksheetContextProvider = React.forwardRef<
  WorksheetContextProviderElement,
  WorksheetContextProviderProps
>(({ children, sheet: sheetName, onChangeSelection }, ref) => {
  const readWorksheet = useWorkbookActions((actions) => actions.readWorksheet);

  const _sheet = readWorksheet({ name: sheetName });

  const { selection } = _sheet || {};

  const selectionCache = React.useRef(selection);

  const isSelectionChanged = !isEqual(selection, selectionCache.current);

  const [cellDefaultsByColumn, setCellDefaultsByColumn] = React.useState<
    Record<
      WorksheetCell["column"],
      {
        defaultWidth?: WorksheetCellProps["defaultWidth"];
        defaultHeight?: WorksheetCellProps["defaultHeight"];
      }
    >
  >({});

  React.useEffect(
    function cacheSelection() {
      selectionCache.current = selection;
    },
    [selection]
  );

  React.useEffect(
    function handleSelectionChange() {
      if (selection && isSelectionChanged) {
        onChangeSelection?.(selection);
      }
    },
    [onChangeSelection, selection, isSelectionChanged]
  );

  const setWorkbook = useWorkbookActions((actions) => actions.setWorkbook);

  const [cellRenderers, setCellRenderers] = React.useState<
    Record<string, CellRenderer | undefined>
  >({});

  // const readWorksheet = useWorkbookActions((actions) => actions.readWorksheet)
  // const updateWorksheet = useWorkbookActions((actions) => actions.updateWorksheet)

  const onSheetChange = React.useCallback(
    (getChanges: (sheet: Worksheet) => Partial<Worksheet>) => {
      setWorkbook((prevWorkbook) => {
        return {
          ...prevWorkbook,
          sheets: prevWorkbook.sheets.map((s) =>
            s.name === sheetName ? { ...s, ...getChanges(s) } : s
          ),
        };
      });
    },
    [sheetName, setWorkbook]
  );

  const addRow = React.useCallback(
    (row: string) => {
      onSheetChange((sheet) => {
        const { rows = [] } = sheet || {};
        return { rows: [...rows, row] };
      });
    },
    [onSheetChange]
  );

  const addColumn = React.useCallback(
    (
      column: string,
      cellProps: {
        defaultWidth?: WorksheetCellProps["defaultWidth"];
        defaultHeight?: WorksheetCellProps["defaultHeight"];
      } = {}
    ) => {
      onSheetChange((sheet) => {
        const { columns = [] } = sheet || {};
        return { columns: [...columns, column] };
      });

      setCellDefaultsByColumn((prevCellDefaultsByColumn) => ({
        ...prevCellDefaultsByColumn,
        [column]: cellProps,
      }));
    },
    [onSheetChange]
  );

  const removeRow = React.useCallback(
    (row: string) => {
      onSheetChange((sheet) => {
        const { rows = [] } = sheet || {};
        return { rows: rows.filter((r) => r !== row) };
      });
    },
    [onSheetChange]
  );

  const removeColumn = React.useCallback(
    (column: string) => {
      onSheetChange((sheet) => {
        const { columns = [] } = sheet || {};
        return { columns: columns.filter((col) => col !== column) };
      });
    },
    [onSheetChange]
  );

  const onSelect = React.useCallback(
    (selection?: WorksheetSelection) => {
      onSheetChange(() => ({ selection }));
    },
    [onSheetChange]
  );

  const onSelectColumn = React.useCallback(
    (column: string) => {
      onSelect({
        sheet: sheetName,
        type: "column",
        column,
      });
    },
    [sheetName, onSelect]
  );

  const onSelectRow = React.useCallback(
    (row: string) => {
      onSelect({ sheet: sheetName, type: "row", row });
    },
    [sheetName, onSelect]
  );

  const onSelectCell = React.useCallback(
    (row: string, column: string) => {
      onSelect({
        sheet: sheetName,
        type: "cell",
        row,
        column,
      });
    },
    [sheetName, onSelect]
  );

  const onClearSelection = React.useCallback(() => {
    onSelect(undefined);
  }, [onSelect]);

  const getCellProps = React.useCallback(
    (
      column: WorksheetCell["column"],
      defaultCellProps: {
        defaultWidth?: WorksheetCellProps["defaultWidth"];
        defaultHeight?: WorksheetCellProps["defaultHeight"];
      } = {}
    ) => {
      const cellProps = get(cellDefaultsByColumn, column, {}) as {
        defaultWidth?: WorksheetCellProps["defaultWidth"];
        defaultHeight?: WorksheetCellProps["defaultHeight"];
      };

      return {
        defaultWidth: cellProps.defaultWidth || defaultCellProps.defaultWidth,
        defaultHeight:
          cellProps.defaultHeight || defaultCellProps.defaultHeight,
      };
    },
    [cellDefaultsByColumn]
  );

  const renderCell = React.useCallback(
    (cell: WorksheetCell) => {
      const Cell = cellRenderers[cell.column] || DefaultCell;
      const cellProps = getCellProps(cell.column);

      return <Cell {...cellProps} {...cell} />;
    },
    [cellRenderers, getCellProps]
  );

  const onRenderColumn = React.useCallback(
    (column: string, renderCell?: CellRenderer) => {
      setCellRenderers((prevCellRenderers) => ({
        ...prevCellRenderers,
        [column]: renderCell,
      }));
    },
    []
  );

  const state: SpreadsheetStateContext = { sheet: _sheet };

  const actions: SpreadsheetActionsContext = {
    addRow,
    addColumn,

    removeRow,
    removeColumn,

    onSelectColumn,
    onSelectRow,
    onSelectCell,

    onClearSelection,

    renderCell,
    onRenderColumn,

    getCellProps,
  };

  const element: WorksheetContextProviderElement = {
    ...state,
    ...actions,
  };

  useSetRef(ref, element);

  // React.useEffect(() => {
  //   if (typeof ref === "function") {
  //     ref(element);
  //   } else if (ref) {
  //     ref.current = element;
  //   }
  // });

  return (
    <SpreadsheetStateContext.Provider value={state}>
      <SpreadsheetActionsContext.Provider value={actions}>
        {children}
      </SpreadsheetActionsContext.Provider>
    </SpreadsheetStateContext.Provider>
  );
});

export default WorksheetContextProvider;
