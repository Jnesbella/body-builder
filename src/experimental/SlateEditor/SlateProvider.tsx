import * as React from "react";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";
import { createEditor as defaultCreateEditor, Descendant } from "slate";

import { withPlugins } from "./slatePlugins";
import { SlateStateContext } from "./SlateStateContext";
import { SlateActions } from "./SlateActions";

const createEditor = () =>
  withPlugins(withReact(withHistory(defaultCreateEditor())));

export interface SlateProviderProps {
  children: React.ReactNode;
}

function SlateProvider({ children }: SlateProviderProps) {
  const [editor, setEditor] = React.useState(createEditor());

  const setValue = React.useCallback((_value: Descendant[]) => {}, []);

  return (
    <SlateStateContext.Provider value={{ editor }}>
      <SlateActions.Provider value={{ setValue }}>
        {children}
      </SlateActions.Provider>
    </SlateStateContext.Provider>
  );
}

export default SlateProvider;
