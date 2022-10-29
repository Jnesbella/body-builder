import * as React from "react";
import isHotkey from "is-hotkey";
import {
  Editable,
  withReact,
  Slate,
  ReactEditor,
  DefaultPlaceholder,
} from "slate-react";
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
import styled from "styled-components/native";
import { debounce, isNumber, pick } from "lodash";

import { theme } from "../../styles";
import { InputOutline } from "../../components/TextInput";
import Pressable from "../Pressable";
import { ListItemElement } from "../../slateTypings";
import { useSetRef } from "../../hooks";

import { withPlugins } from "./slatePlugins";
import { deserializeHTML } from "./slatePlugins/slateHTML";
import SlateElement from "./SlateElement";
import SlateLeaf from "./SlateLeaf";
import { HOTKEYS, DEFAULT_VALUE } from "./slateConstants";
import { Editor, Element } from "./customSlate";
import SlateProvider from "./SlateProvider";
import SlateBlockButton from "./SlateBlockButton";
import SlateMarkButton from "./SlateMarkButton";
import useSlateState from "./useSlateState";

const InputPressable = styled(Pressable)`
  overflow: hidden;
  background: ${theme.colors.transparent};
`;

export interface SlateEditorProps {
  value?: Descendant[];
  placeholder?: string;
  onChange?: (value: Descendant[]) => void;
  disabled?: boolean;
  maxLength?: number;
  characterCount?: React.DetailedReactHTMLElement<any, HTMLElement>;
  readonly?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  children?: (props: { children: React.ReactNode }) => JSX.Element;
  renderEditable?: (props: React.PropsWithChildren<{}>) => JSX.Element;
  isFocused?: boolean;
  name?: string;
  fullWidth?: boolean;
  above?: React.ReactNode;
  below?: React.ReactNode;
}

export interface SlateEditorElement {
  name?: string;
  focus: () => void;
  blur: () => void;
  editor?: DefaultEditor;
  clear: () => void;
}

const SlateEditor = React.forwardRef<SlateEditorElement, SlateEditorProps>(
  (
    {
      value = DEFAULT_VALUE,
      placeholder,
      onChange,
      disabled,
      maxLength = -1,
      readonly,
      onFocus: onFocusProp,
      onBlur: onBlurProp,
      name = "",
      fullWidth,
      above,
      below,
    },
    ref
  ) => {
    // const blurTooltip = useTooltipActions((actions) => actions.blurTooltip);

    const isConstrainedByMaxLength = isNumber(maxLength) && maxLength >= 0;

    const renderElement = SlateElement;

    const renderLeaf = SlateLeaf;

    const editor = useSlateState((state) => state.editor);

    const { selection } = editor;

    const focus = React.useCallback(() => {
      if (!ReactEditor.isFocused(editor)) {
        ReactEditor.focus(editor);
      }
    }, [editor]);

    const blur = React.useCallback(() => {
      if (ReactEditor.isFocused(editor)) {
        ReactEditor.blur(editor);
      }
    }, [editor]);

    const clear = React.useCallback(() => {
      Transforms.delete(editor, {
        at: {
          anchor: Editor.start(editor, []),
          focus: Editor.end(editor, []),
        },
      });
    }, [editor]);

    const element = React.useMemo<SlateEditorElement>(
      () => ({
        name,
        focus,
        blur,
        editor,
        clear,
      }),
      [focus, blur, editor, name, clear]
    );

    const onBlurCache = React.useRef(onBlurProp);

    React.useEffect(function handleCacheBlurHandler() {
      onBlurCache.current = onBlurProp;
    });

    const onBlur = React.useMemo(
      () =>
        debounce(() => {
          onBlurCache.current?.();
          Transforms.deselect(editor);
        }, 250),
      [editor]
    );

    const onFocus = () => {
      onBlur.cancel();
      onFocusProp?.();
    };

    useSetRef(ref, element);

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

      // log({ event });

      const isEnter = event.key === "Enter";
      const isArrowDown = event.key === "ArrowDown";
      const isArrowUp = event.key === "ArrowUp";

      // log({ isEnter, isArrowDown, isArrowUp });
    };

    const handleInsertFromPaste = (event: DragEvent & InputEvent) => {
      let text = event.dataTransfer?.getData("text/plain");
      let html = event.dataTransfer?.getData("text/html");

      if (html) {
        const parsed = new DOMParser().parseFromString(html, "text/html");
        const fragment = deserializeHTML(parsed.body);
        Transforms.insertFragment(editor, fragment);

        return;
      }

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

      const isSelectionCollapsed = selection && Range.isCollapsed(selection);

      const isDeleteBackwards = event.inputType === "deleteContentBackward";
      if (isDeleteBackwards) {
        const [element, path] = Editor.getSelectedElement(editor) || [];

        // TODO
        // is first element
        // is list item
        // is start edge

        if (element && path) {
          const [parent, parentPath] = Editor.parent(editor, path);
          const isListItem = Element.isListItemElement(parent);
          const isEmpty = Editor.isEmpty(editor, element);
          const { focus } = editor.selection || {};

          const isSelectionFocusStart = focus
            ? Editor.isStart(editor, focus, path)
            : false;

          const isFirstElement = path.every((index) => index === 0);

          if (
            isListItem &&
            isSelectionFocusStart &&
            isSelectionCollapsed &&
            isFirstElement
          ) {
            // is at beginning of list item
            // so toggle the list item

            event.preventDefault();

            const { listType } = parent as ListItemElement;
            if (listType) {
              Editor.toggleListElement(editor, listType);
            }
          } else if (isEmpty && isSelectionCollapsed) {
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

    // const EditableWrapper = ({ children }: { children?: React.ReactNode }) => (
    //   <InputPressable focusable={false} focusOn="none" fullWidth={fullWidth}>
    //     {(pressableProps) => (
    //       <InputOutline
    //         {...pick(pressableProps, ["focused", "pressed", "hovered"])}
    //         spacingSize={0}
    //         fullWidth={fullWidth}
    //       >
    //         {children}
    //       </InputOutline>
    //     )}
    //   </InputPressable>
    // );

    return (
      <Slate editor={editor} value={value} onChange={onChange}>
        {above}

        <InputPressable focusable={false} focusOn="none" fullWidth={fullWidth}>
          {(pressableProps) => (
            <InputOutline
              {...pick(pressableProps, ["focused", "pressed", "hovered"])}
              spacingSize={0}
              fullWidth={fullWidth}
              disabled={disabled}
            >
              <Editable
                placeholder={placeholder}
                className="editable"
                readOnly={readonly || disabled}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                renderPlaceholder={(placeholderProps) => {
                  return (
                    <DefaultPlaceholder
                      {...placeholderProps}
                      attributes={{
                        ...placeholderProps.attributes,
                        style: {
                          ...placeholderProps.attributes.style,
                          opacity: 1,
                          color: theme.colors.textPlaceholder,
                        },
                      }}
                    />
                  );
                }}
                spellCheck
                onKeyDown={handleKeyDown}
                onDOMBeforeInput={(event) => {
                  onDOMBeforeInput(event as DragEvent & InputEvent);
                }}
                onFocus={() => {
                  onFocus?.();
                  pressableProps.focus();
                }}
                onBlur={() => {
                  onBlur?.();
                  pressableProps.blur();
                }}
                style={{
                  padding: `${theme.spacing / 2}px ${theme.spacing}px`,
                  width: fullWidth ? "100%" : undefined,
                  boxSizing: "border-box",
                }}
              />
            </InputOutline>
          )}
        </InputPressable>

        {below}
      </Slate>
    );
  }
);

type SlateEditor = typeof SlateEditor & {
  Provider: typeof SlateProvider;
  BlockButton: typeof SlateBlockButton;
  MarkButton: typeof SlateMarkButton;
};

(SlateEditor as SlateEditor).Provider = SlateProvider;
(SlateEditor as SlateEditor).BlockButton = SlateBlockButton;
(SlateEditor as SlateEditor).MarkButton = SlateMarkButton;

export default SlateEditor as SlateEditor;
