import * as React from "react";

import SlateEditor, { Editor, SlateEditorToolbar } from "./SlateEditor";

import { TextInput as DefaultTextInput } from "react-native";
import styled, { css } from "styled-components/native";

import { darkenColor, theme } from "../../styles";
import { PressableState } from "../../components/componentsTypes";
import Layout from "../../components/Layout";

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
} from "../../components";

type TextInputProps = React.ComponentProps<typeof DefaultTextInput> &
  Greedy &
  Full;

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

export interface RichTextInputProps {
  onChangeText?: (text: string) => void;
  defaultValue?: string;
  disabled?: boolean;
}

function RichTextInput({
  defaultValue,
  onChangeText,
  disabled,
}: RichTextInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <InputPressable>
      {(state) => (
        <InputOutline {...state} focused={isFocused}>
          <SlateEditor
            toolbar={<SlateEditorToolbar disabled={disabled} />}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            defaultValue={
              defaultValue ? Editor.fromJSON(defaultValue) : undefined
            }
            onChange={(nextValue) => onChangeText?.(Editor.toJSON(nextValue))}
            disabled={disabled}
          />
        </InputOutline>
      )}
    </InputPressable>
  );
}

export default RichTextInput;
