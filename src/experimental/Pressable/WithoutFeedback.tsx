import * as React from "react";
import styled from "styled-components";

import PressableWebAdapter, {
  PressableWebAdapterProps,
} from "./PressableWebAdapter";

export interface WithoutFeedbackProps extends PressableWebAdapterProps {}

const WithoutFeedback = styled(PressableWebAdapter)<WithoutFeedbackProps>``;

export default WithoutFeedback;
