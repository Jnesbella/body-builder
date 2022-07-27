import * as React from "react";
import { Editor as DefaultEditor } from "slate";

import SlateEditor, {
  Editor,
  SlateEditorFooter,
  SlateEditorToolbar,
  SlateEditorElement,
  SlateEditorProps,
} from "./SlateEditor";

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
  name?: SlateEditorProps["name"];
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
      onFocus,
      footer,
      toolbar,
      name,
    },
    ref
  ) => {
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
        defaultValue={defaultValue ? Editor.fromJSON(defaultValue) : undefined}
        onChange={(nextValue) => onChangeText?.(Editor.toJSON(nextValue))}
        disabled={disabled}
        onFocus={onFocus}
        footer={footer}
        name={name}
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
