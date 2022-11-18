import { PressableActions } from "./PressableActions";
import { PressableState } from "./PressableState";

export interface PressableElement extends PressableActions, PressableState {}

export type RenderPressableChildren = (
  props: PressableElement
) => React.ReactNode;
