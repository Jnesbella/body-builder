import * as React from "react";
import styled, { css } from "styled-components/native";

import SlateEditor, {
  Editor,
  SlateEditorFooter,
  SlateEditorToolbar,
  SlateEditorElement,
  SlateEditorProps,
} from "./SlateEditor";

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
import { InputOutline } from "../../components/TextInput";

const InputPressable = styled.Pressable`
  overflow: hidden;
  background: ${theme.colors.transparent};
`;

// const InputOutline = styled(Layout.Box).attrs(
//   ({ hovered, focused }: PressableState) => ({
//     borderColor:
//       hovered || focused ? theme.colors.primary : theme.colors.transparent,

//     background: focused ? theme.colors.background : theme.colors.transparent,
//   })
// )<PressableState>`
//   ${background};
//   ${rounded};
//   ${bordered};

//   padding: 0 ${theme.spacing}px;
// `;

// const InputOutline = styled(Layout.Box).attrs({
//   borderColor: theme.colors.primary,
// })<PressableState>`
//   ${background};
//   ${rounded};
//   ${bordered};

//   padding: 0 ${theme.spacing}px;
// `;

export interface RichTextInputProps {
  onChangeText?: (text: string) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: SlateEditorProps["placeholder"];
  isFocused?: SlateEditorProps["isFocused"];
  onFocus?: SlateEditorProps["onFocus"];
}

function RichTextInput({
  defaultValue,
  onChangeText,
  disabled,
  placeholder,
  isFocused,
  onFocus,
}: RichTextInputProps) {
  // const [isFocused, setIsFocused] = React.useState(false);
  const editorRef = React.useRef<SlateEditorElement>(null);

  return (
    <SlateEditor
      ref={editorRef}
      placeholder={placeholder}
      toolbar={<SlateEditorToolbar disabled={disabled} />}
      // onBlur={() => setIsFocused(false)}
      // onFocus={() => setIsFocused(true)}
      defaultValue={defaultValue ? Editor.fromJSON(defaultValue) : undefined}
      onChange={(nextValue) => onChangeText?.(Editor.toJSON(nextValue))}
      disabled={disabled}
      isFocused={isFocused}
      onFocus={onFocus}
      // renderEditable={({ children }) => {
      //   return (
      //     <InputPressable
      //       onPress={() => {
      //         console.log("FOCUS");
      //         editorRef.current?.focus();
      //       }}
      //     >
      //       {(state: PressableState) => (
      //         <InputOutline {...state} focused={state.focused || isFocused}>
      //           {children}
      //         </InputOutline>
      //       )}
      //     </InputPressable>
      //   );
      // }}
      footer={<SlateEditorFooter />}
    />
  );
}

export default RichTextInput;
