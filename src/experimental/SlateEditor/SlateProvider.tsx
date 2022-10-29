import * as React from "react";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";
import { createEditor } from "slate";

import { withPlugins } from "./slatePlugins";
import { SlateStateContext } from "./SlateStateContext";

function useEditor() {
  const editor = React.useMemo(
    // () => withHistory(withReact(withPlugins(createEditor()))),
    () => withPlugins(withReact(withHistory(createEditor()))),
    []
  );

  return editor;
}

export interface SlateProviderProps {
  children: React.ReactNode;
}

function SlateProvider({ children }: SlateProviderProps) {
  const editor = useEditor();

  return (
    <SlateStateContext.Provider value={{ editor }}>
      {children}
    </SlateStateContext.Provider>
  );
}

export default SlateProvider;
