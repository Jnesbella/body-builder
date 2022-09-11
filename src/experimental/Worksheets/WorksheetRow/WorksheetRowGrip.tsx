import * as React from "react";

import { useFlubberGripSize } from "../../../components";

import SpreadsheetGrip, { SPREADSHEET_GRIP_SIZE } from "../WorksheetGrip";

import WorksheetRow from "./WorksheetRow";

export interface SpreadsheetGripRowProps {
  rowAbove: string;
  rowBelow: string;
}

function SpreadsheetGripRow({ rowAbove, rowBelow }: SpreadsheetGripRowProps) {
  const row = rowAbove + "-grip-" + rowBelow;
  const gripSize = useFlubberGripSize(SPREADSHEET_GRIP_SIZE);

  return (
    <WorksheetRow
      row={row}
      defaultHeight={gripSize}
      renderCell={(props) => {
        const { column } = props;

        return (
          <SpreadsheetGrip
            key={[row, column].join("-")}
            pushAndPull={[rowAbove, rowBelow]}
            orientation="horizontal"
            greedy
          />
        );
      }}
    />
  );
}

export default SpreadsheetGripRow;
