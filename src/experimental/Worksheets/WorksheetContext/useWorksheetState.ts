import * as React from "react";

import { SpreadsheetStateContext } from "./WorksheetContext";

function useWorksheetState<Output>(
  select: (context: SpreadsheetStateContext) => Output
) {
  const context = React.useContext(SpreadsheetStateContext);

  if (context === null) {
    throw new Error(
      "useWorksheetState must be used within a SpreadsheetStateContext"
    );
  }

  return select(context);
}

export default useWorksheetState;
