import * as React from "react";
import styled from "styled-components";

import { full, Full, greedy, Greedy } from "../../components";
import { setRef } from "../../utils";

import { RenderPressableChildren } from "./pressable-types";
import { renderPressableChildren } from "./pressable-utils";
import { usePressableElement } from "./pressable-hooks";

export interface PressableWebAdapterContainerProps
  extends Full,
    Greedy,
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    > {}

const PressableWebAdapterContainer = styled.div<PressableWebAdapterContainerProps>`
  ${greedy};
  ${full};

  user-select: none;
  display: inline-flex;
`;

export type PressableWebAdapterElement = HTMLDivElement;

export interface PressableWebAdapterProps
  extends PressableWebAdapterContainerProps {
  children?: React.ReactNode | RenderPressableChildren;
  disabled?: boolean;
  focusable?: boolean;
}

const PressableWebAdapter = React.forwardRef<
  PressableWebAdapterElement,
  PressableWebAdapterProps
>(
  (
    {
      greedy,
      fullHeight,
      fullWidth,
      children,

      ...rest
    },
    ref
  ) => {
    const pressableElement = usePressableElement();

    const isFocusable = false;

    const handleRef = (node: HTMLDivElement | null) => {
      if (node) {
        const { focus: focusNode, blur: blurNode } = node;

        node.blur = () => {
          pressableElement.blur();
          blurNode();
        };

        node.focus = (_options?: FocusOptions) => {
          pressableElement.focus();
          focusNode();
        };
      }

      setRef(ref, pressableElement);
    };

    return (
      <PressableWebAdapterContainer
        {...rest}
        ref={handleRef}
        tabIndex={isFocusable ? 0 : undefined}
        fullHeight={fullHeight}
        fullWidth={fullWidth}
        greedy={greedy}
        // focused
        onFocus={() => pressableElement.focus()}
        onBlur={() => pressableElement.blur()}
        // hovered
        onPointerOver={() => pressableElement.hoverOver()}
        onPointerOut={() => pressableElement.hoverOut()}
        // pressed
        onPointerDown={() => pressableElement.pressIn()}
        onPointerUp={() => pressableElement.pressOut()}
      >
        {renderPressableChildren(pressableElement, children)}
      </PressableWebAdapterContainer>
    );
  }
);

export default PressableWebAdapter;
