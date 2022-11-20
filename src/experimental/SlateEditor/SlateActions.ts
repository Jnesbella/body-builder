import * as React from "react";
import { Descendant } from "slate";

export interface SlateActions {
  setValue: (value: Descendant[]) => void;
}

export const SlateActions = React.createContext<SlateActions | null>(null);
