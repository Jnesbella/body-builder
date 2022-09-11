import * as React from "react";

import { WorkbookStateContext } from "./WorkbookContext";

function useWorkbookState<Output>(
  selector: (state: WorkbookStateContext) => Output
) {
  const context = React.useContext(WorkbookStateContext);

  if (context === null) {
    throw new Error(
      "useWorkbookState must be used within a WorkbookStateContext"
    );
  }

  return selector(context);
}

export default useWorkbookState;
