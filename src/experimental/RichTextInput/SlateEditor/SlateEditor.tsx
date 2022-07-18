import * as React from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, Slate, ReactEditor } from "slate-react";
import {
  createEditor,
  Descendant,
  Node,
  Path,
  Range,
  Transforms,
  Editor as DefaultEditor,
} from "slate";
import { withHistory } from "slate-history";
import styled, { css } from "styled-components/native";

// import { getPlainText } from "slate-react/dist/utils/dom";

import SlateElement from "./SlateElement";
import SlateLeaf from "./SlateLeaf";
import { HOTKEYS, DEFAULT_VALUE } from "./slateConstants";
import { Editor, Element } from "./slate";
import { theme } from "../../../styles";
import { InputOutline } from "../../../components/TextInput";
import { Pressable, PressableActions, PressableState } from "../../Pressable";
import { isNumber, last, pick } from "lodash";
import { log } from "../../../utils";
import {
  CustomElement,
  ListElement,
  ListItemElement,
  ParagraphElement,
} from "../../../typings-slate";

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
  editor?: DefaultEditor;
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

    console.log("value: ", { value });

    const isConstrainedByMaxLength = isNumber(maxLength) && maxLength >= 0;

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

    const focus = () => {
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

      log({ event });

      const isEnter = event.key === "Enter";
      const isArrowDown = event.key === "ArrowDown";
      const isArrowUp = event.key === "ArrowUp";

      log({ isEnter, isArrowDown, isArrowUp });
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

      console.log("onDOMBeforeInput: ", { inputType, event });

      // handle paste events
      const isInsertFromPaste = event.inputType === "insertFromPaste";
      if (isInsertFromPaste) {
        event.preventDefault();
        handleInsertFromPaste(event);

        return;
      }

      // handle line length validation
      const isDelete = inputType.includes("delete");
      const isLengthValid =
        !isConstrainedByMaxLength || Editor.getTextLength(editor) < maxLength;

      if (!isLengthValid && !isDelete) {
        event.preventDefault();

        return;
      }

      const { selection } = editor;
      const isSelectionCollapsed = selection && Range.isCollapsed(selection);

      const isDeleteBackwards = event.inputType === "deleteContentBackward";
      if (isDeleteBackwards) {
        const [element, path] = Editor.getSelectedElement(editor) || [];

        if (element && path) {
          const [parent, parentPath] = Editor.parent(editor, path);
          const isListItem = Element.isListItemElement(parent);
          const isEmpty = Editor.isEmpty(editor, element);

          if (isEmpty && isSelectionCollapsed) {
            // is empty element
            // so remove the node

            event.preventDefault();

            const pathToSiblings = isListItem ? parentPath : path;

            const [prevSibling] = Path.hasPrevious(pathToSiblings)
              ? Editor.node(editor, Path.previous(pathToSiblings))
              : [];

            const [nextSibling] = Node.has(editor, Path.next(pathToSiblings))
              ? Editor.node(editor, Path.next(pathToSiblings))
              : [];

            const shouldMergeSiblings =
              prevSibling &&
              Element.isElement(prevSibling) &&
              nextSibling &&
              Element.isElement(nextSibling) &&
              Element.isListElement(prevSibling) &&
              nextSibling.type === prevSibling.type;

            Editor.deleteBackward(editor);

            if (shouldMergeSiblings) {
              Transforms.mergeNodes(editor, { at: path });
            }
          }
        }

        return;
      }

      // handle insert paragraph
      const isInsertParagraph = event.inputType === "insertParagraph";
      if (isInsertParagraph) {
        const [element, path] = Editor.getSelectedElement(editor) || [];

        if (element && path) {
          const [parent, parentPath] = Editor.parent(editor, path);
          const isListItem = Element.isListItemElement(parent);
          const isEmpty = Editor.isEmpty(editor, element);

          if (isListItem) {
            event.preventDefault();

            if (isEmpty) {
              // is empty list item
              // so lift format element out of list

              // TODO: confirm this line can be removed
              // Transforms.setNodes(editor, { type: "paragraph" }, { at: path });

              // lift to the list-item level
              Transforms.liftNodes(editor, { at: path });

              // lift to the list level
              // Transforms.liftNodes(editor, { at: path.slice(0, -1) });
              Transforms.liftNodes(editor, { at: Path.parent(path) });
            } else {
              // is list-item with content
              // so insert a new list item

              Editor.insertBreak(editor);

              // wrap each format element in a list-item element
              Transforms.wrapNodes(
                editor,
                {
                  type: "list-item",
                  listType: (parent as ListItemElement).listType,
                  children: [],
                },
                {
                  at: Path.next(path),
                  match: (node) =>
                    !Editor.isEditor(node) &&
                    Element.isElement(node) &&
                    Element.isFormatElement(node),
                  // mode: "lowest",
                }
              );

              Transforms.liftNodes(editor, { at: Path.next(path) });
            }
          } else {
            // Editor.insertNode(editor, {
            //   type: "paragraph",
            //   children: [{ text: "" }],
            // });
          }
        }

        return;
      }
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
        {toolbar}

        <InputPressable isFocused={isFocused}>
          {(pressableProps: PressableState & PressableActions) => (
            <React.Fragment>
              {/* {!readonly && !disabled && (
                <ToolbarWrapper
                  isVisible
                  // isVisible={pressableProps.focused || pressableProps.hovered}
                >
                  {toolbar}
                </ToolbarWrapper>
              )} */}

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
