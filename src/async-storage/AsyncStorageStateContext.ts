import * as React from "react";

import { AsyncStorage, NoopStorage } from "../async-storage";

export interface AsyncStorageStateContext {
  storage: AsyncStorage;
}

const context = React.createContext<AsyncStorageStateContext>({
  storage: new NoopStorage(),
});

export default context;
