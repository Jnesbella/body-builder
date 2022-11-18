import * as React from "react";
import styled from "styled-components/native";

import { background, Background, rounded, Rounded } from "../../components";
import { theme } from "../../styles";

import { PressableProviderElement } from "./PressableProvider";
import WithoutFeedback, { WithoutFeedbackProps } from "./WithoutFeedback";

export interface PressableWithFeedbackProps
  extends WithoutFeedbackProps,
    PressableProviderElement,
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
