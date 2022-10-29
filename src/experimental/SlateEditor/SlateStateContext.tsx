import * as React from "react";
import { Editor as DefaultEditor } from "slate";

export interface SlateStateContext {
  editor: DefaultEditor;
}

export const SlateStateContext = React.createContext<SlateStateContext | null>(
  null
);
