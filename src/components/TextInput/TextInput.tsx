import * as React from "react";
import { TextInput as DefaultTextInput } from "react-native";
import styled, { css } from "styled-components/native";
import Pressable, {
  PressableActions,
  PressableProps,
} from "../../experimental/Pressable";

import { theme } from "../../styles";
import { bordered, Bordered } from "../bordered";
import { PressableState } from "../componentsTypes";
import Layout from "../Layout";

import {
  Greedy,
  Full,
  FontSize,
  color,
  fontSize,
  rounded,
  greedy,
  full,
  background,
  SpacingProps,
  spacing,
  Rounded,
  Background,
} from "../styled-components";
import { text, TextProps } from "../Text";

type DefaultTextInputProps = Omit<
  React.ComponentProps<typeof DefaultTextInput>,
  "children" | "onFocus" | "onBlur" | "textAlign"
>;

export interface TextInputProps
  extends DefaultTextInputProps,
    Greedy,
    Full,
    Rounded,
    Background,
    TextProps,
    Bordered {
  onPress?: PressableProps["onPress"];
  onFocus?: PressableProps["onFocus"];
  onBlur?: PressableProps["onBlur"];
  children?:
    | React.ReactNode
    | ((props: React.PropsWithChildren<PressableState>) => JSX.Element);
}

export type StyledTextInputProps = PressableState &
  SpacingProps &
  TextInputProps;

const StyledTextInput = styled.TextInput.attrs<StyledTextInputProps>(
  ({ spacingSize = [1, 0] }) => ({
    fontSize: FontSize.Normal,
    placeholderTextColor: theme.colors.textPlaceholder,
    spacingSize,
  })
)<StyledTextInputProps>`
  min-height: ${theme.spacing * 4}px;

  ${spacing};
  ${rounded};
  ${greedy};
  ${full};
  ${text};

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

export type InputOutlineProps = PressableState &
  SpacingProps &
  Background &
  Rounded &
  Bordered;

export const InputOutline = styled(Layout.Box).attrs<InputOutlineProps>(
  ({
    hovered,
    focused,
    background = theme.colors.transparent,
    borderColor = theme.colors.primary,
  }) => ({
    borderColor: hovered || focused ? borderColor : theme.colors.transparent,
    background: focused ? theme.colors.background : background,
  })
)<InputOutlineProps>`
  ${background};
  ${rounded};
  ${bordered};
`;

function TextInput({
  children: Children,
  onFocus,
  onBlur,
  greedy,
  onPress,
  fullWidth,
  background,
  roundness,
  borderColor,
  borderWidth,
  ...textInputProps
}: TextInputProps) {
  const textInputRef = React.useRef<DefaultTextInput>(null);

  return (
    <InputPressable
      focusable={false}
      focusOnPress
      onFocus={() => {
        onFocus?.();
        textInputRef.current?.focus();
      }}
      onBlur={() => {
        onBlur?.();
        textInputRef.current?.blur();
      }}
      greedy={greedy}
      onPress={onPress}
      fullWidth={fullWidth}
    >
      {(pressableProps: PressableState & PressableActions) => (
        <InputOutline
          {...pressableProps}
          greedy={greedy}
          fullWidth={fullWidth}
          background={background}
          roundness={roundness}
          borderColor={borderColor}
          borderWidth={borderWidth}
        >
          <StyledTextInput
            {...(textInputProps as unknown as any)}
            ref={textInputRef}
            greedy={greedy}
            fullWidth={fullWidth}
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
