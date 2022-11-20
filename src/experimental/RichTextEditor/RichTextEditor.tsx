import * as React from "react";

import SlateEditor, {
  SlateEditorProps,
  SlateEditorElement,
} from "../SlateEditor";

import RichTextEditorToolbar from "./RichTextEditorToolbar";

export interface RichTextEditorElement extends SlateEditorElement {}

export interface RichTextEditorProps extends SlateEditorProps {}

const RichTextEditor = React.forwardRef<
  RichTextEditorElement,
  RichTextEditorProps
>(({ ...editorProps }, ref) => {
  return (
    <SlateEditor.Provider>
      <SlateEditor {...editorProps} ref={ref} />
    </SlateEditor.Provider>
  );
});

type RichTextEditor = typeof SlateEditor & {
  Toolbar: typeof RichTextEditorToolbar;
};

(RichTextEditor as RichTextEditor).Toolbar = RichTextEditorToolbar;

export default RichTextEditor as RichTextEditor;
