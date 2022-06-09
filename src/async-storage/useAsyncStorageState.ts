import * as React from "react";

import AsyncStorageState, {
  AsyncStorageStateContext,
} from "./AsyncStorageStateContext";

export function useAsyncStorageState<Output>(
  select: (context: AsyncStorageStateContext) => Output
) {
  const context = React.useContext(AsyncStorageState);

  return select(context);
}

export default useAsyncStorageState;
