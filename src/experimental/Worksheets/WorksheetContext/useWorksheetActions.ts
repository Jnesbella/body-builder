import * as React from "react";

import { SpreadsheetActionsContext } from "./WorksheetContext";

function useWorksheetActions<Output>(
  select: (context: SpreadsheetActionsContext) => Output
) {
  const context = React.useContext(SpreadsheetActionsContext);

  if (context === null) {
    throw new Error(
      "useWorksheetActions must be used within a SpreadsheetActionsContext"
    );
  }

  return select(context);
}

export default useWorksheetActions;
