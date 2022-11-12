import { createContext } from "react";

import { AppState, AppActions } from "../types";

export const AppStateContext = createContext<AppState | null>(null);

export const AppActionsContext = createContext<AppActions | null>(null);
