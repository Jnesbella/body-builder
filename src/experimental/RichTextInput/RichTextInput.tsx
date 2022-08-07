import * as React from "react";
import { Descendant, Editor as DefaultEditor } from "slate";

import SlateEditor, {
  Editor,
  SlateEditorFooter,
  SlateEditorElement,
  SlateEditorProps,
} from "./SlateEditor";

export interface RichTextInputElement {
  editor?: DefaultEditor;
}

export interface RichTextInputProps {
  name?: SlateEditorProps["name"];
  disabled?: SlateEditorProps["disabled"];
  onChange?: SlateEditorProps["onChange"];
  placeholder?: SlateEditorProps["placeholder"];
  onFocus?: SlateEditorProps["onFocus"];
  onBlur?: SlateEditorProps["onBlur"];
  value?: SlateEditorProps["value"];
}

const RichTextInput = React.forwardRef<
  RichTextInputElement,
  RichTextInputProps
>(({ onChange, disabled, placeholder, onFocus, name, onBlur, value }, ref) => {
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
      onChange={onChange}
      disabled={disabled}
      onFocus={onFocus}
      onBlur={onBlur}
      name={name}
      value={value}
    />
  );
});

type RichTextInput = typeof RichTextInput & {
  Footer: typeof SlateEditorFooter;
};

(RichTextInput as RichTextInput).Footer = SlateEditorFooter;

export default RichTextInput as RichTextInput;
