import * as React from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, Slate } from "slate-react";
import { createEditor, Descendant } from "slate";
import { withHistory } from "slate-history";
// import { getPlainText } from "slate-react/dist/utils/dom";

import SlateElement from "./SlateElement";
import SlateLeaf from "./SlateLeaf";
import { HOTKEYS, DEFAULT_VALUE } from "./slateConstants";
import { Editor } from "./slate";

const RenderElement = SlateElement;

const RenderLeaf = SlateLeaf;

export interface SlateEditorProps {
  defaultValue?: Descendant[];
  placeholder?: string;
  onChange?: (value: Descendant[]) => void;
  disabled?: boolean;
  maxLength?: number;
  // value?: Descendant[];
  toolbar?: React.ReactNode;
  characterCount?: React.DetailedReactHTMLElement<any, HTMLElement>;
  readonly?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

function SlateEditor(props: SlateEditorProps) {
  const {
    defaultValue = DEFAULT_VALUE,
    placeholder,
    onChange,
    disabled,
    maxLength,
    // value: valueProp,
    toolbar,
    characterCount,
    readonly,
    onFocus,
    onBlur,
  } = props;
  const [value, setValue] = React.useState<Descendant[]>(defaultValue);
  const renderElement = React.useCallback(
    (props) => <SlateElement {...props} />,
    []
  );
  const renderLeaf = React.useCallback((props) => <SlateLeaf {...props} />, []);
  const editor = React.useMemo(
    () => withHistory(withReact(createEditor())),
    []
  );

  // React.useEffect(() => {
  //   if (!valueProp) return;

  //   setValue(valueProp);
  // }, [valueProp]);

  const processHotkeys = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let marked = false;

    Object.values(HOTKEYS).forEach((hotkey) => {
      const { nativeEvent } = event;

      const mark = isHotkey(hotkey, nativeEvent) ? HOTKEYS[hotkey] : null;
      if (mark) {
        marked = true;
        Editor.toggleMark(editor, mark);
      }
    });

    if (marked) {
      event.preventDefault();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    processHotkeys(event);
  };

  const handleInsertFromPaste = (event: DragEvent & InputEvent) => {
    let text = event.dataTransfer?.getData("text/plain");
    if (!text) {
      return;
    }

    if (maxLength) {
      const charCount = Editor.getTextLength(editor);
      const charsLeft = maxLength - charCount;

      if (text.length > charsLeft) {
        // text = text.substr(0, charsLeft);
        text = text.substring(0, charsLeft);
      }
    }

    editor.insertText(text);
  };

  const onDOMBeforeInput = (event: DragEvent & InputEvent) => {
    const { inputType } = event;

    const isInsertFromPaste = event.inputType === "insertFromPaste";
    if (isInsertFromPaste) {
      event.preventDefault();
      handleInsertFromPaste(event);

      return;
    }

    const isDelete = inputType.includes("delete");
    if (isDelete) {
      return;
    }

    const isLengthValid =
      !maxLength || Editor.getTextLength(editor) < maxLength;
    if (isLengthValid) {
      return;
    }

    event.preventDefault();
  };

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(nextValue) => {
        onChange?.(nextValue);
        setValue(nextValue);
      }}
    >
      {!readonly && !disabled && toolbar}

      <Editable
        placeholder={placeholder}
        className="editable"
        readOnly={readonly || disabled}
        renderElement={renderLeaf}
        renderLeaf={renderLeaf}
        spellCheck
        autoFocus
        onKeyDown={handleKeyDown}
        onDOMBeforeInput={(event) => {
          onDOMBeforeInput(event as DragEvent & InputEvent);
        }}
        onFocus={() => onFocus?.()}
        onBlur={() => onBlur?.()}
      />

      {characterCount &&
        React.cloneElement(characterCount, {
          maxLength,
          characterCount: Editor.getTextLength(editor),
        })}
    </Slate>
  );
}

export default SlateEditor;
