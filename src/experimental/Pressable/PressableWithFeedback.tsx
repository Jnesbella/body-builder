import * as React from "react";

import { PressableElement } from "./pressable-types";
import { renderPressableChildren } from "./pressable-utils";
import Pressable, { PressableProps } from "./Pressable2";

import WithoutFeedback from "./WithoutFeedback";

export interface PressableWithFeedbackProps extends PressableProps {
  renderFeedback?: (props: PressableElement) => JSX.Element;
}

function PressableWithFeedback({
  renderFeedback: Feedback = WithoutFeedback,
  children,
  ...rest
}: PressableWithFeedbackProps) {
  return (
    <Pressable {...rest}>
      {(pressableElement) => (
        <Feedback {...pressableElement}>
          {renderPressableChildren(pressableElement, children)}
        </Feedback>
      )}
    </Pressable>
  );
}

export default PressableWithFeedback;
