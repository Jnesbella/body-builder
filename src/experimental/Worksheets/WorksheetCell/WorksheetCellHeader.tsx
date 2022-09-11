import * as React from "react";
// import {
//   Button,
//   TextAlign,
//   log,
//   Text,
//   fontWeight,
//   FontWeight,
//   theme,
// } from "@jnesbella/body-builder";
import styled from "styled-components/native";

import {
  Button,
  TextAlign,
  Text,
  FontWeight,
  fontWeight,
} from "../../../components";
import { theme } from "../../../styles";

import { useWorksheetActions } from "../WorksheetContext";
import useIsSelected from "../useIsSelected";

import SpreadsheetCellContent, {
  SpreadsheetCellContentProps,
} from "./WorksheetCellContent";

const HeaderText = styled(Text.Label).attrs({ fontWeight: FontWeight.Bold })`
  ${fontWeight};
`;

export interface SpreadsheetHeaderCellProps
  extends SpreadsheetCellContentProps {
  label?: string;
  mode: "row" | "column";
}

function SpreadsheetHeaderCell({
  label: labelProp,
  mode,
  children: _children,
  ...cell
}: SpreadsheetHeaderCellProps) {
  const { row, column } = cell;
  const isSelected = useIsSelected.Cell(cell);
  const label = labelProp || row || column;

  const { onSelectColumn, onSelectRow, onClearSelection } = useWorksheetActions(
    (actions) => actions
  );

  return (
    <SpreadsheetCellContent {...cell} background={theme.colors.transparent}>
      <Button
        greedy
        onPress={() => {
          if (isSelected) {
            onClearSelection();
          } else if (mode === "row") {
            onSelectRow(row);
          } else if (mode === "column") {
            onSelectColumn(column);
          }
        }}
      >
        <HeaderText textAlign={TextAlign.Center}>{label}</HeaderText>
      </Button>
    </SpreadsheetCellContent>
  );
}

export default SpreadsheetHeaderCell;
