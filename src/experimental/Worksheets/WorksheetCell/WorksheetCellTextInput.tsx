import * as React from "react";

import { useWorksheetActions, useWorksheetState } from "../WorksheetContext";
import useIsSelected from "../useIsSelected";

import SpreadsheetCellContent, {
  SpreadsheetCellContentProps,
} from "./WorksheetCellContent";
import { Bordered, Layout, TextInput } from "../../../components";
import { theme } from "../../../styles";
import { log } from "../../../utils";

export interface SpreadsheetTextInputProps extends SpreadsheetCellContentProps {
  onChangeText?: (text: string) => void;
  value?: string;
  autoFocus?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  borderColor?: Bordered["borderColor"];
}

function SpreadsheetTextInput({
  onChangeText,
  value,
  children: _children,
  autoFocus,
  onBlur,
  onFocus,
  borderColor,
  ...cell
}: SpreadsheetTextInputProps) {
  const { row, column } = cell;
  const isSelected = useIsSelected.Cell(cell);

  const selection = useWorksheetState((state) => state.sheet?.selection);
  const isCellSelection = selection?.type === "cell";

  const editable = isSelected && isCellSelection;

  const onSelectCell = useWorksheetActions((actions) => actions.onSelectCell);

  log({ isSelected, row: cell.row, column: cell.column });

  return (
    <SpreadsheetCellContent {...cell}>
      {/* <Button greedy onPress={() => onSelectCell(row, column)} spacingSize={0}> */}
      <Layout.Box spacingSize={0.25} greedy>
        <TextInput
          // onPress={() => onSelectCell(row, column)}
          onFocus={() => {
            onSelectCell(row, column);
            onFocus?.();
          }}
          greedy
          fullWidth
          multiline
          editable={editable}
          onChangeText={onChangeText}
          value={value}
          autoFocus={autoFocus || isSelected}
          onBlur={onBlur}
          borderColor={borderColor}
          background={theme.colors.transparent}

          // readonly={!editable}
          // editable={false}
          // onContentSizeChange={(event) => {
          //   log({ contentSize: event.nativeEvent.contentSize })
          // }}
        />
      </Layout.Box>
      {/* </Button> */}
    </SpreadsheetCellContent>
  );
}

export default SpreadsheetTextInput;
