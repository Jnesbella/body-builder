import * as React from "react";
import { TextInput as DefaultTextInput } from "react-native";
import styled, { css } from "styled-components/native";
import Pressable, { PressableActions } from "../../experimental/Pressable";

import { theme } from "../../styles";
import { PressableState } from "../componentsTypes";
import Layout from "../Layout";

import {
  Greedy,
  Full,
  FontSize,
  color,
  fontSize,
  rounded,
  bordered,
  greedy,
  full,
  background,
  SpacingProps,
  spacing,
} from "../styled-components";

export type TextInputProps = Omit<
  React.ComponentProps<typeof DefaultTextInput> & Greedy & Full,
  "children" | "onFocus" | "onBlur"
> & {
  onFocus?: () => void;
  onBlur?: () => void;
  children?:
    | React.ReactNode
    | ((props: React.PropsWithChildren<PressableState>) => JSX.Element);
};

const StyledTextInput = styled.TextInput.attrs({
  fontSize: FontSize.Normal,
  placeholderTextColor: theme.colors.textPlaceholder,
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

const InputPressable = styled(Pressable)`
  overflow: hidden;
  background: ${theme.colors.transparent};
`;

export const InputOutline = styled(Layout.Box).attrs(
  ({
    hovered,
    focused,
    spacingSize = [1, 0],
  }: PressableState & SpacingProps) => ({
    borderColor:
      hovered || focused ? theme.colors.primary : theme.colors.transparent,

    background: focused ? theme.colors.background : theme.colors.transparent,

    spacingSize,
  })
)<PressableState>`
  ${background};
  ${rounded};
  ${bordered};
  ${spacing};
`;

function TextInput({
  children: Children,
  onFocus,
  onBlur,
  ...textInputProps
}: TextInputProps) {
  return (
    <InputPressable onFocus={onFocus} onBlur={onBlur}>
      {(pressableProps: PressableState & PressableActions) => (
        <InputOutline {...pressableProps}>
          <StyledTextInput
            {...(textInputProps as unknown as any)}
            onFocus={() => {
              pressableProps.focus();
            }}
            onBlur={() => {
              pressableProps.blur();
            }}
            autoComplete="off"
            autoCompleteType="off"
          />
        </InputOutline>
      )}
    </InputPressable>
  );
}

export default TextInput;
