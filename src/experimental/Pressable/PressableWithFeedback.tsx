import * as React from "react";

import { PressableProviderElement } from "./PressableProvider";

export interface PressableWithFeedbackProps {
  renderHoveredFeedback?: (props: PressableProviderElement) => JSX.Element;
  renderPressedFeedback?: (props: PressableProviderElement) => JSX.Element;
}

function PressableWithFeedback() {
  return null;
}

export default PressableWithFeedback;
