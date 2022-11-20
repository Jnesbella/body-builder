import * as React from "react";
import styled from "styled-components";

import { background, Background, rounded, Rounded } from "../../components";
import { theme } from "../../styles";
import { PressableElement } from "./pressable-types";

import WithoutFeedback, { WithoutFeedbackProps } from "./WithoutFeedback";

export interface PressableWithFeedbackProps
  extends WithoutFeedbackProps,
    PressableElement,
    Background,
    Rounded {
  disabled?: boolean;
}

export const PressableWithFeedback = styled(
  WithoutFeedback
).attrs<PressableWithFeedbackProps>(
  ({
    hovered,
    focused,
    background: backgroundProp = theme.colors.backgroundInfo,
    disabled,
  }) => {
    const background = disabled
      ? theme.colors.transparent
      : hovered || focused
      ? backgroundProp
      : theme.colors.background;

    return {
      background,
    };
  }
)<PressableWithFeedbackProps>`
  ${background};
  ${rounded};

  overflow: hidden;
`;

export default PressableWithFeedback;
