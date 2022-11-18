import * as React from "react";
import { PressableState as DefaultPressableState } from "../../components/componentsTypes";

export interface PressableState extends DefaultPressableState {}

export const PressableState = React.createContext<PressableState | null>(null);
