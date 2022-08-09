import * as React from "react";
import { TextInput as DefaultTextInput } from "react-native";
import styled, { css } from "styled-components/native";
import Pressable, {
  PressableActions,
  PressableProps,
} from "../../experimental/Pressable";

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

type DefaultTextInputProps = Omit<
  React.ComponentProps<typeof DefaultTextInput>,
  "children" | "onFocus" | "onBlur"
>;

export interface TextInputProps extends DefaultTextInputProps, Greedy, Full {
  onPress?: PressableProps["onPress"];
  onFocus?: PressableProps["onFocus"];
  onBlur?: PressableProps["onBlur"];
  children?:
    | React.ReactNode
    | ((props: React.PropsWithChildren<PressableState>) => JSX.Element);
}

const StyledTextInput = styled.TextInput.attrs({
  fontSize: FontSize.Normal,
  placeholderTextColor: theme.colors.textPlaceholder,
})<TextInputProps & PressableState>`
  outline-width: 0;
  min-height: ${theme.spacing * 4}px;

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
  greedy,
  onPress,
  fullWidth,
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
        <InputOutline {...pressableProps} greedy={greedy} fullWidth={fullWidth}>
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
