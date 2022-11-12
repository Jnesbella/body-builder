import * as React from "react";
import { AppActionsContext, AppStateContext } from "../common/contexts";
import { useListChannels } from "../hooks";
import { AppActions, AppState } from "../types";

export interface AppProviderProps {
  children?: React.ReactNode;
  initialState?: AppState;
}

function AppProvider({ children, initialState }: AppProviderProps) {
  const { data: channels } = useListChannels();

  const [search, setSearch] = React.useState<AppState["search"]>(
    initialState?.search || channels[0]
  );

  const state: AppState = {
    search,
  };

  const actions: AppActions = {
    setSearch,
  };

  return (
    <AppStateContext.Provider value={state}>
      <AppActionsContext.Provider value={actions}>
        {children}
      </AppActionsContext.Provider>
    </AppStateContext.Provider>
  );
}

export default AppProvider;
