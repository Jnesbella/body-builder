import * as React from "react";

import Pressable, { PressableProps } from "./Pressable";

import OutlineFeedback from "./OutlineFeedback";

export interface PressableWithFeedbackProps extends PressableProps {}

function PressableWithFeedback({
  renderAdapter: Adapter = OutlineFeedback,
  ...rest
}: PressableWithFeedbackProps) {
  return <Pressable {...rest} />;
}

export default PressableWithFeedback;
