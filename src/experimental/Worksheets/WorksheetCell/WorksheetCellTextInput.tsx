import * as React from "react";

import { useWorksheetActions, useWorksheetState } from "../WorksheetContext";
import useIsSelected from "../useIsSelected";

import SpreadsheetCellContent, {
  SpreadsheetCellContentProps,
} from "./WorksheetCellContent";
import { TextInput } from "../../../components";

export interface SpreadsheetTextInputProps extends SpreadsheetCellContentProps {
  onChangeText?: (text: string) => void;
  value?: string;
  autoFocus?: boolean;
  onBlur?: () => void;
}

function SpreadsheetTextInput({
  onChangeText,
  value,
  children: _children,
  autoFocus,
  onBlur,
  ...cell
}: SpreadsheetTextInputProps) {
  const { row, column } = cell;
  const isSelected = useIsSelected.Cell(cell);

  const selection = useWorksheetState((state) => state.sheet?.selection);
  const isCellSelection = selection?.type === "cell";

  const editable = isSelected && isCellSelection;

  const onSelectCell = useWorksheetActions((actions) => actions.onSelectCell);

  return (
    <SpreadsheetCellContent {...cell}>
      {/* <Button greedy onPress={() => onSelectCell(row, column)} spacingSize={0}> */}
      <TextInput
        // onPress={() => onSelectCell(row, column)}
        onFocus={() => onSelectCell(row, column)}
        greedy
        fullWidth
        multiline
        editable={editable}
        onChangeText={onChangeText}
        value={value}
        autoFocus={autoFocus || isSelected}
        onBlur={onBlur}

        // readonly={!editable}
        // editable={false}
        // onContentSizeChange={(event) => {
        //   log({ contentSize: event.nativeEvent.contentSize })
        // }}
      />
      {/* </Button> */}
    </SpreadsheetCellContent>
  );
}

export default SpreadsheetTextInput;
