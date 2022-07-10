import * as React from "react";
import { TextInput as DefaultTextInput } from "react-native";
import styled, { css } from "styled-components/native";

import { darkenColor, theme } from "../../styles";
import { log } from "../../utils";
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

export type TextInputProps = Omit<
  React.ComponentProps<typeof DefaultTextInput> & Greedy & Full,
  "children"
> & {
  children?:
    | React.ReactNode
    | ((props: React.PropsWithChildren<PressableState>) => JSX.Element);
};

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

export const InputOutline = styled(Layout.Box).attrs(
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

function TextInput({
  children: Children,
  onFocus,
  onBlur,
  ...textInputProps
}: TextInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  // log("TextInput", { isFocused });

  const Input = React.useCallback(
    (state: PressableState) => (
      <InputOutline {...state} focused={isFocused}>
        <StyledTextInput
          {...(textInputProps as unknown as any)}
          onFocus={(_e) => {
            // onFocus?.(e);
            // setIsFocused(true);
          }}
          onBlur={(_e) => {
            // onBlur?.(e);
            // setIsFocused(false);
          }}
        />
      </InputOutline>
    ),
    []
  );

  return (
    <InputPressable>
      {
        (state: PressableState) => (
          <InputOutline {...state} focused={isFocused}>
            <StyledTextInput
              {...(textInputProps as unknown as any)}
              onFocus={(e) => {
                onFocus?.(e);
                setIsFocused(true);
              }}
              onBlur={(e) => {
                onBlur?.(e);
                setIsFocused(false);
              }}
            />
          </InputOutline>
        )
        // typeof Children === "function" ? (
        //   <Children {...state}>{Input}</Children>
        // ) : (
        //   <Input {...state} />
        // )
      }
    </InputPressable>
  );
}

export default TextInput;
