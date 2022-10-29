import * as React from "react";

import { SlateStateContext } from "./SlateStateContext";

function useSlateState<Output>(selector: (state: SlateStateContext) => Output) {
  const context = React.useContext(SlateStateContext);

  if (context === null) {
    throw new Error("useSlateState must be used within a SlateStateContext");
  }

  return selector(context);
}

export default useSlateState;
