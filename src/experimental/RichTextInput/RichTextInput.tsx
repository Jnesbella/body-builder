import * as React from "react";
import styled, { css } from "styled-components/native";
import { Editor as DefaultEditor } from "slate";

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
  Space,
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

export interface RichTextInputElement {
  editor?: DefaultEditor;
}

export interface RichTextInputProps {
  onChangeText?: (text: string) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: SlateEditorProps["placeholder"];
  isFocused?: SlateEditorProps["isFocused"];
  onFocus?: SlateEditorProps["onFocus"];
  footer?: SlateEditorProps["footer"];
  toolbar?: SlateEditorProps["toolbar"];
}

const RichTextInput = React.forwardRef<
  RichTextInputElement,
  RichTextInputProps
>(
  (
    {
      defaultValue,
      onChangeText,
      disabled,
      placeholder,
      // isFocused,
      onFocus,
      footer,
      toolbar,
    },
    ref
  ) => {
    // const [isFocused, setIsFocused] = React.useState(false);
    const editorRef = React.useRef<SlateEditorElement>(null);

    React.useEffect(() => {
      const element: RichTextInputElement = {
        editor: editorRef.current?.editor,
      };

      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    });

    return (
      <SlateEditor
        ref={editorRef}
        placeholder={placeholder}
        toolbar={toolbar}
        // toolbar={
        //   <React.Fragment>
        //     <SlateEditorToolbar disabled={disabled} />
        //     <Space />
        //   </React.Fragment>
        // }
        // onBlur={() => setIsFocused(false)}
        // onFocus={() => setIsFocused(true)}
        defaultValue={defaultValue ? Editor.fromJSON(defaultValue) : undefined}
        onChange={(nextValue) => onChangeText?.(Editor.toJSON(nextValue))}
        disabled={disabled}
        // isFocused={isFocused}
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
        footer={footer}
        // footer={
        //   <React.Fragment>
        //     <Space />
        //     <SlateEditorFooter />
        //   </React.Fragment>
        // }
      />
    );
  }
);

type RichTextInput = typeof RichTextInput & {
  Toolbar: typeof SlateEditorToolbar;
  Footer: typeof SlateEditorFooter;
};

(RichTextInput as RichTextInput).Toolbar = SlateEditorToolbar;
(RichTextInput as RichTextInput).Footer = SlateEditorFooter;

export default RichTextInput as RichTextInput;
