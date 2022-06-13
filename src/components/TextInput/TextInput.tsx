import * as React from "react";
import { TextInput as DefaultTextInput } from "react-native";
import styled, { css } from "styled-components/native";

import { darkenColor, theme } from "../../styles";
import { PressableState } from "../componentsTypes";
import Layout from "../Layout";

import {
  Greedy,
  Full,
  FontSize,
  color,
  fontSize,
  outlineColor,
  rounded,
  bordered,
  greedy,
  full,
  background,
  Background,
} from "../styled-components";

type TextInputProps = React.ComponentProps<typeof DefaultTextInput> &
  Greedy &
  Full;

const StyledTextInput = styled.TextInput.attrs({
  fontSize: FontSize.Normal,
})<TextInputProps & PressableState>`
  outline-width: 0;

  ${color};
  ${fontSize};
  ${rounded};
  ${greedy};
  ${full};

  ${({ multiline }) => {
    if (multiline) {
      return css`
        font-size: 14px;
        line-height: 19px;
      `;
    }
  }}
`;

const InputPressable = styled.Pressable`
  overflow: hidden;
  background: ${theme.colors.transparent};
`;

const InputOutline = styled(Layout.Box).attrs(
  ({ hovered, focused }: PressableState) => ({
    borderColor:
      hovered || focused ? theme.colors.primary : theme.colors.transparent,

    background: focused ? theme.colors.background : theme.colors.transparent,
  })
)<PressableState>`
  ${background};
  ${rounded};
  ${bordered};

  padding: 0 ${theme.spacing}px;
`;

function TextInput(props: TextInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <InputPressable>
      {(state: PressableState) => (
        <InputOutline {...state} focused={isFocused}>
          <StyledTextInput
            {...(props as unknown as any)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </InputOutline>
      )}
    </InputPressable>
  );
}

export default TextInput;
