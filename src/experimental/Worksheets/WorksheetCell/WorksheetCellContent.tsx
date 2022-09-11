import * as React from "react";

import { Background, Surface } from "../../../components";
import { theme } from "../../../styles";
// import { Surface, theme, Background } from '@jnesbella/body-builder';

import useIsSelected from "../useIsSelected";

import { WorksheetCellProps } from "./worksheetCellTypes";

export interface SpreadsheetCellContentProps
  extends WorksheetCellProps,
    Background {}

function SpreadsheetCellContent({
  children,
  background = theme.colors.background,
  ...cell
}: SpreadsheetCellContentProps) {
  const isSelected = useIsSelected.Cell(cell);

  return (
    <Surface greedy background={isSelected ? theme.colors.white : background}>
      <Surface
        greedy
        background={
          isSelected ? theme.colors.accentLight : theme.colors.transparent
        }
      >
        {children}
      </Surface>
    </Surface>
  );
}

export default SpreadsheetCellContent;
