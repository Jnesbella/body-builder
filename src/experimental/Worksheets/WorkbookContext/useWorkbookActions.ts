import * as React from "react";

import { WorkbookActionsContext } from "./WorkbookContext";

function useWorkbookActions<Output>(
  selector: (actions: WorkbookActionsContext) => Output
) {
  const context = React.useContext(WorkbookActionsContext);

  if (context === null) {
    throw new Error(
      "useWorkbookActions must be used within a WorkbookActionsContext"
    );
  }

  return selector(context);
}

export default useWorkbookActions;
