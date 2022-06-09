import * as React from "react";

import AsyncStorageState, {
  AsyncStorageStateContext,
} from "./AsyncStorageStateContext";

import { AsyncStorage, NoopStorage } from ".";

const DEFAULT_STORAGE = new NoopStorage();

export interface ProviderProps {
  storage: AsyncStorage;
  children?: React.ReactNode;
}

function AsyncStorageProvider({
  storage = DEFAULT_STORAGE,
  children,
}: ProviderProps) {
  return (
    <AsyncStorageState.Provider value={{ storage }}>
      {children}
    </AsyncStorageState.Provider>
  );
}

export default AsyncStorageProvider;
