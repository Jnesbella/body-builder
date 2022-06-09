import * as React from "react";
import { TextInput as DefaultTextInput, Pressable } from "react-native";
import styled, { css } from "styled-components/native";

import { darkenColor, theme } from "../styles";
import { PressableState } from "./componentsTypes";

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
} from "./styled-components";

type TextInputProps = React.ComponentProps<typeof DefaultTextInput> &
  Greedy &
  Full & {
    // readonly?: boolean
  };

const StyledTextInput = styled.TextInput.attrs(
  ({
    editable = true,
    hovered,
    focused,
  }: { editable?: boolean; multiline?: boolean } & PressableState) => ({
    fontSize: FontSize.Normal,
    outlineColor: theme.colors.primary,
    background:
      hovered && editable && !focused
        ? darkenColor(theme.colors.background, 10)
        : theme.colors.transparent,
    borderColor: theme.colors.transparent,
  })
)<TextInputProps & PressableState>`
  ${background};
  ${color};
  ${fontSize};
  ${outlineColor};
  ${rounded};
  ${bordered};
  ${greedy};
  ${full};

  padding: 0 ${theme.spacing}px;

  ${({ multiline }) => {
    if (multiline) {
      return css`
        font-size: 14px;
        line-height: 19px;
      `;
    }
  }}
`;

function TextInput(props: TextInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <Pressable>
      {(state: PressableState) => (
        <StyledTextInput
          {...(props as unknown as any)}
          {...state}
          focused={isFocused}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      )}
    </Pressable>
  );
}

export default TextInput;
