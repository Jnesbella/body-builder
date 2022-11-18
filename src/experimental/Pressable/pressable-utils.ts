import { RenderPressableChildren, PressableElement } from "./pressable-types";

export const renderPressableChildren = (
  element: PressableElement,
  children?: React.ReactNode | RenderPressableChildren
) => {
  return children && typeof children === "function"
    ? (children as RenderPressableChildren)(element)
    : children;
};
