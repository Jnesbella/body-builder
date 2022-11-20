import * as React from "react";
import styled from "styled-components";

import {
  background,
  Background,
  bordered,
  Bordered,
  rounded,
  Rounded,
} from "../../components";
import { theme } from "../../styles";

import { PressableElement } from "./pressable-types";

import WithoutFeedback, { WithoutFeedbackProps } from "./WithoutFeedback";

export interface OutlineFeedbackProps
  extends WithoutFeedbackProps,
    PressableElement,
    Background,
    Rounded,
    Bordered {
  disabled?: boolean;
}

export const OutlineFeedback = styled(
  WithoutFeedback
).attrs<OutlineFeedbackProps>(
  ({
    hovered,
    focused,
    background: backgroundProp = theme.colors.transparent,
    borderColor: borderColorProp = theme.colors.primary,
    disabled,
  }) => {
    const borderColor = disabled
      ? theme.colors.transparent
      : hovered || focused
      ? borderColorProp
      : theme.colors.backgroundDivider;

    const background = focused ? theme.colors.background : backgroundProp;

    return {
      borderColor,
      background,
    };
  }
)<OutlineFeedbackProps>`
  ${background};
  ${rounded};
  ${bordered};

  overflow: hidden;
`;

export default OutlineFeedback;
