import * as React from "react";
import { Descendant, Editor as DefaultEditor } from "slate";

import { useSetRef } from "../../hooks";
import { log } from "../../utils";

import SlateEditor, {
  Editor,
  SlateEditorFooter,
  SlateEditorElement,
  SlateEditorProps,
} from "./SlateEditor";
import Toolbar from "./RichTextToolbar";

export interface RichTextInputElement {
  getEditor: () => DefaultEditor | undefined;
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

  const element: RichTextInputElement = {
    getEditor: () => editorRef.current?.editor,
  };

  useSetRef(ref, element);

  // React.useEffect(() => {

  //   if (typeof ref === "function") {
  //     ref(element);
  //   } else if (ref) {
  //     ref.current = element;
  //   }
  // });

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
  Toolbar: typeof Toolbar;
};

(RichTextInput as RichTextInput).Footer = SlateEditorFooter;
(RichTextInput as RichTextInput).Toolbar = Toolbar;

export default RichTextInput as RichTextInput;
