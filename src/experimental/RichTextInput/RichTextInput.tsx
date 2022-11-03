import * as React from "react";

import { log } from "../../utils";

import SlateEditor, {
  SlateEditorFooter,
  SlateEditorElement,
  SlateEditorProps,
} from "../SlateEditor";
import SlateProvider from "../SlateEditor/SlateProvider";
import Toolbar from "./RichTextToolbar";

export interface RichTextInputElement extends SlateEditorElement {}

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
  return (
    <SlateProvider>
      <SlateEditor
        ref={ref}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        onFocus={onFocus}
        onBlur={onBlur}
        name={name}
        value={value}
      />
    </SlateProvider>
  );
});

type RichTextInput = typeof RichTextInput & {
  Footer: typeof SlateEditorFooter;
  Toolbar: typeof Toolbar;
};

(RichTextInput as RichTextInput).Footer = SlateEditorFooter;
(RichTextInput as RichTextInput).Toolbar = Toolbar;

export default RichTextInput as RichTextInput;
