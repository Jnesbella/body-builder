import * as React from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, Slate, ReactEditor } from "slate-react";
import { createEditor, Descendant } from "slate";
import { withHistory } from "slate-history";
import styled, { css } from "styled-components/native";

// import { getPlainText } from "slate-react/dist/utils/dom";

import SlateElement from "./SlateElement";
import SlateLeaf from "./SlateLeaf";
import { HOTKEYS, DEFAULT_VALUE } from "./slateConstants";
import { Editor } from "./slate";
import { theme } from "../../../styles";
import { InputOutline } from "../../../components/TextInput";
import { Pressable, PressableActions, PressableState } from "../../Pressable";
import { isNumber, pick } from "lodash";

const InputPressable = styled(Pressable)`
  overflow: hidden;
  background: ${theme.colors.transparent};
`;

const ToolbarWrapper = styled.View<{ isVisible?: boolean }>`
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
`;

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
  children?: (props: { children: React.ReactNode }) => JSX.Element;
  renderEditable?: (props: React.PropsWithChildren<{}>) => JSX.Element;
  footer?: React.ReactNode;
  isFocused?: boolean;
}

export interface SlateEditorElement {
  focus: () => void;
}

const SlateEditor = React.forwardRef<SlateEditorElement, SlateEditorProps>(
  (
    {
      defaultValue = DEFAULT_VALUE,
      placeholder,
      onChange,
      disabled,
      maxLength = -1,
      // value: valueProp,
      toolbar,
      // characterCount,
      readonly,
      onFocus,
      // onBlur,
      // children: Container = React.Fragment,
      // renderEditable: Wrapper = React.Fragment,
      footer,
      isFocused,
    },
    ref
  ) => {
    const [value, setValue] = React.useState<Descendant[]>(defaultValue);

    const isConstrainedByMaxLength = isNumber(maxLength) && maxLength >= 0;

    // const [isFocused, setIsFocused] = React.useState(false);

    const renderElement = React.useCallback(
      (props) => <SlateElement {...props} />,
      []
    );

    const renderLeaf = React.useCallback(
      (props) => <SlateLeaf {...props} />,
      []
    );

    const editor = React.useMemo(
      () => withHistory(withReact(createEditor())),
      []
    );

    console.log({ editor });

    const focus = () => {
      console.log("FOCUS");
      ReactEditor.focus(editor);
    };

    React.useEffect(function handleRef() {
      const element: SlateEditorElement = {
        focus,
      };

      if (typeof ref === "function") {
        ref(element);
      } else if (ref && "current" in ref) {
        ref.current = element;
      }
    });

    // React.useEffect(() => {
    //   if (!valueProp) return;

    //   setValue(valueProp);
    // }, [valueProp]);

    const processHotkeys = (event: React.KeyboardEvent<HTMLDivElement>) => {
      // let marked = false;

      Object.values(HOTKEYS).forEach((hotkey) => {
        const { nativeEvent } = event;

        const mark = isHotkey(hotkey, nativeEvent) ? HOTKEYS[hotkey] : null;
        if (mark) {
          // marked = true;
          event.preventDefault();
          Editor.toggleMark(editor, mark);
        }
      });

      // if (marked) {
      //   event.preventDefault();
      // }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      processHotkeys(event);
    };

    const handleInsertFromPaste = (event: DragEvent & InputEvent) => {
      let text = event.dataTransfer?.getData("text/plain");
      if (!text) {
        return;
      }

      // enforce max length
      // TODO: maybe extract this to a helper function
      if (isConstrainedByMaxLength) {
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
        !isConstrainedByMaxLength || Editor.getTextLength(editor) < maxLength;

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
        <InputPressable isFocused={isFocused}>
          {(pressableProps: PressableState & PressableActions) => (
            <React.Fragment>
              {!readonly && !disabled && (
                <ToolbarWrapper
                  // isVisible
                  isVisible={pressableProps.focused || pressableProps.hovered}
                >
                  {toolbar}
                </ToolbarWrapper>
              )}

              <InputOutline
                {...pick(pressableProps, ["focused", "pressed", "hovered"])}
              >
                <Editable
                  placeholder={placeholder}
                  className="editable"
                  readOnly={readonly || disabled}
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  spellCheck
                  onKeyDown={handleKeyDown}
                  onDOMBeforeInput={(event) => {
                    onDOMBeforeInput(event as DragEvent & InputEvent);
                  }}
                  onFocus={() => {
                    onFocus?.();
                    pressableProps.focus();
                  }}
                  onBlur={() => pressableProps.blur()}
                  // onBlur={() => setIsFocused(false)}
                  // onFocus={() => setIsFocused(true)}
                />
              </InputOutline>
            </React.Fragment>
          )}
        </InputPressable>

        {footer}
      </Slate>
    );
  }
);

export default SlateEditor;
