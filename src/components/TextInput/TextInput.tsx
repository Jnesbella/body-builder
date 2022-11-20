import * as React from "react";
import { TextInput as DefaultTextInput } from "react-native";
import styled, { css } from "styled-components/native";

import Pressable, {
  PressableElement,
  PressableProps,
} from "../../experimental/Pressable";
import { theme } from "../../styles";

import { PressableState } from "../componentsTypes";
import Layout from "../Layout";
import {
  Greedy,
  Full,
  FontSize,
  rounded,
  greedy,
  full,
  background,
  SpacingProps,
  spacing,
  Rounded,
  Background,
  Bordered,
  bordered,
} from "../styled-components";
import { text, DefaultTextProps } from "../Text";

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
    DefaultTextProps,
    Bordered {
  onPress?: PressableProps["onPress"];
  onFocus?: PressableProps["onFocus"];
  onBlur?: PressableProps["onBlur"];
  children?:
    | React.ReactNode
    | ((props: React.PropsWithChildren<PressableState>) => JSX.Element);
  start?: React.ReactNode;
}

export interface StyledTextInputProps
  extends PressableState,
    SpacingProps,
    TextInputProps {}

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
`;

export interface InputOutlineProps
  extends PressableElement,
    SpacingProps,
    Background,
    Rounded,
    Bordered {
  disabled?: boolean;
}

export const InputOutline = styled(Layout.Box).attrs<InputOutlineProps>(
  ({
    hovered,
    focused,
    background = theme.colors.transparent,
    borderColor: borderColorProp = theme.colors.primary,
    disabled,
  }) => {
    let borderColor =
      hovered || focused ? borderColorProp : theme.colors.backgroundDivider;

    if (disabled) {
      borderColor = theme.colors.transparent;
    }

    return {
      borderColor,
      background: focused ? theme.colors.background : background,
    };
  }
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
  start,
  style = {},
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
      {(pressableProps: PressableElement) => (
        <InputOutline
          {...pressableProps}
          greedy={greedy}
          fullWidth={fullWidth}
          background={background}
          roundness={roundness}
          borderColor={borderColor}
          borderWidth={borderWidth}
        >
          <Layout.Row alignItems="center" fullWidth={fullWidth}>
            {start}

            <StyledTextInput
              {...(textInputProps as unknown as any)}
              background={background}
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
              style={{
                outline: "none",
                ...(style as object),
              }}
            />
          </Layout.Row>
        </InputOutline>
      )}
    </InputPressable>
  );
}

export default TextInput;
