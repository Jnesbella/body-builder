import * as React from "react";
import {
  useAsyncStorageState,
  log,
  useOnValueChange,
} from "@jnesbella/body-builder";
import { useMutation, useQuery } from "react-query";

import { AppActionsContext, AppStateContext } from "../common/contexts";
import { useListChannels } from "../hooks";
import { AppActions, AppState } from "../types";

const STORAGE_KEY = "state";

export interface AppProviderProps {
  children?: React.ReactNode;
  initialState?: AppState;
}

function AppProvider({ children, initialState }: AppProviderProps) {
  const storage = useAsyncStorageState((state) => state.storage);

  const loadStateFromStorage = () => storage.getItemAsync(STORAGE_KEY);

  const storeStateInStorage = (state: AppState) =>
    storage.setItemAsync(STORAGE_KEY, state);

  const { data: defaultState } = useQuery<AppState | null>(
    STORAGE_KEY,
    loadStateFromStorage,
    {
      suspense: true,
    }
  );

  const { mutate: storeState } = useMutation(storeStateInStorage);

  const { data: channels } = useListChannels();

  const [search, setSearch] = React.useState<AppState["search"]>(
    defaultState?.search || initialState?.search || channels[0]
  );

  const state = React.useMemo<AppState>(
    () => ({
      search,
    }),
    [search]
  );

  log({ state });

  const actions = React.useMemo<AppActions>(
    () => ({
      setSearch,
    }),
    [setSearch]
  );

  useOnValueChange(state, () => {
    log({ nextState: state });

    storeState(state);
  });

  // React.useEffect(
  //   function storeStateOnStateChange() {
  //     storeState(state);
  //   },
  //   [state, storeState]
  // );

  return (
    <AppStateContext.Provider value={state}>
      <AppActionsContext.Provider value={actions}>
        {children}
      </AppActionsContext.Provider>
    </AppStateContext.Provider>
  );
}

export default AppProvider;
