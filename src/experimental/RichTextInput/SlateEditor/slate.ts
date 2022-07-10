import { get } from "lodash";
import * as React from "react";
import {
  Element as DefaultElement,
  Node,
  Editor as DefaultEditor,
  Descendant,
  Transforms,
  Text,
  Path,
  NodeEntry,
} from "slate";
import { RenderElementProps } from "slate-react";

import {
  CustomElement,
  ListElement,
  FormatElement,
  MarkType,
} from "../../../typings-slate";
import { log } from "../../../utils";

import { LIST_TYPES, FORMAT_TYPES } from "./slateConstants";

export interface SlateElementProps extends RenderElementProps {}

export const Element = {
  ...DefaultElement,

  isListElement: (node: Node, listType?: ListElement["type"]) => {
    return listType
      ? Element.isElementType(node, listType)
      : LIST_TYPES.some((type) => Element.isElementType(node, type));
  },

  isFormatElement: (node: Node, formatType?: FormatElement["type"]) => {
    return formatType
      ? Element.isElementType(node, formatType)
      : FORMAT_TYPES.some((type) => Element.isElementType(node, type));
  },

  isListItemElement: (node: Node) => {
    return Element.isElementType(node, "list-item");
  },

  hasChildren: (node: Node): boolean => {
    return "children" in node && node.children.length > 0;
  },

  getChildren: (node: Node): Node[] | null => {
    if ("children" in node) {
      return node.children;
    }

    return null;
  },

  getText: (node: Node): string => {
    return Node.string(node);

    // let text: string | undefined;

    // if ("text" in node) {
    //   ({ text } = node);
    // } else if (Element.hasChildren(node)) {
    //   const children = Element.getChildren(node) || [];

    //   text = children.map(Element.getText).join("");
    // }

    // return text || "";
  },
};

export const Editor = {
  ...DefaultEditor,

  hasMark: (editor: DefaultEditor, type: MarkType) => {
    const marks = Editor.marks(editor);

    return marks?.[type] === true;
  },

  toggleMark: (editor: DefaultEditor, type: MarkType) => {
    const marked = Editor.hasMark(editor, type);

    if (marked) {
      Editor.removeMark(editor, type);
    } else {
      Editor.addMark(editor, type, true);
    }
  },

  // isBlock: (editor: DefaultEditor, payload: Pick<DefaultElement, "type">) => {
  //   const [match] = Editor.nodes(editor, {
  //     match: (node) => {
  //       const isEditor = Editor.isEditor(node);
  //       const isElementOfType = Element.isType(node, payload.type);

  //       return !isEditor && isElementOfType;
  //     },
  //   });

  //   log("isBlock", { match });

  //   return !!match;
  // },

  isListBlock: (editor: DefaultEditor, listType?: ListElement["type"]) => {
    const [match] = Editor.nodes(editor, {
      match: (node) =>
        !Editor.isEditor(node) &&
        Element.isElement(node) &&
        Element.isListElement(node, listType),
    });

    return !!match;
  },

  toggleListElement: (editor: DefaultEditor, listType: ListElement["type"]) => {
    // const [match] = Editor.nodes(editor, {
    //   match: (node) =>
    //     !Editor.isEditor(node) &&
    //     Element.isElement(node) &&
    //     Element.isListElement(node),
    // });

    // return match;

    const isListElement = Editor.isListBlock(editor);
    const isActiveListElement = Editor.isListBlock(editor, listType);

    log("toggleListElement", { isListElement, isActiveListElement });

    // handle the case of an existing list element
    if (isListElement) {
      // toggle off the list element
      if (isActiveListElement) {
        // lift format elements out of the list-item element
        Transforms.liftNodes(editor, {
          match: (node) =>
            !Editor.isEditor(node) &&
            Element.isElement(node) &&
            Element.isFormatElement(node),
        });

        // lift format elements out of the list element
        Transforms.liftNodes(editor, {
          match: (node) =>
            !Editor.isEditor(node) &&
            Element.isElement(node) &&
            Element.isFormatElement(node),
        });
      } else {
        // find the existing list elements
        const listElementMatches = Editor.nodes(editor, {
          match: (node) =>
            !Editor.isEditor(node) &&
            Element.isElement(node) &&
            Element.isListElement(node),
        });

        // iterate over the list elements
        [...listElementMatches].forEach((match) => {
          const [_node, path] = match;

          // set each list type
          Transforms.setNodes(
            editor,
            { type: listType },
            {
              at: path,
              match: (node) =>
                !Editor.isEditor(node) &&
                Element.isElement(node) &&
                Element.isListElement(node),
              // mode: "all",
            }
          );

          // set each list-item to the correct listType
          Transforms.setNodes(
            editor,
            { listType },
            {
              at: path,
              match: (node) =>
                !Editor.isEditor(node) &&
                Element.isElement(node) &&
                Element.isListItemElement(node),
              // mode: "lowest",
            }
          );
        });

        // Transforms.setNodes(
        //   editor,
        //   { type: listType },
        //   {
        //     match: (node) =>
        //       !Editor.isEditor(node) &&
        //       Element.isElement(node) &&
        //       Element.isListElement(node),
        //     // mode: "all",
        //   }
        // );

        // Transforms.setNodes(
        //   editor,
        //   { listType },
        //   {
        //     match: (node) =>
        //       !Editor.isEditor(node) &&
        //       Element.isElement(node) &&
        //       Element.isElementType(node, "list-item"),
        //     // mode: "lowest",
        //   }
        // );
      }
    }
    // handle the case of no existing list element
    else {
      // find format elements within selection
      const formatElementMatches = Editor.nodes(editor, {
        match: (node) =>
          !Editor.isEditor(node) &&
          Element.isElement(node) &&
          Element.isFormatElement(node),
        mode: "lowest",
      });

      // iterate over format elements
      [...formatElementMatches].forEach((match) => {
        const [node, path] = match;

        log("----");
        log("toggleListElement", { node, path });

        // wrap each format element in a list-item element
        Transforms.wrapNodes(
          editor,
          { type: "list-item", listType, children: [] },
          {
            at: path,
            match: (node) =>
              !Editor.isEditor(node) &&
              Element.isElement(node) &&
              Element.isFormatElement(node),
            // mode: "lowest",
          }
        );
      });

      // Transforms.wrapNodes(
      //   editor,
      //   { type: "list-item", listType, children: [] },
      //   {
      //     match: (node) =>
      //       !Editor.isEditor(node) &&
      //       Element.isElement(node) &&
      //       Element.isFormatElement(node),
      //     // mode: "lowest",
      //   }
      // );

      // wrap all the list-item elements in a list element
      Transforms.wrapNodes(
        editor,
        { type: listType, children: [] },
        {
          match: (node) =>
            !Editor.isEditor(node) &&
            Element.isElement(node) &&
            Element.isElementType(node, "list-item"),
          mode: "highest",
        }
      );

      // ensure each list-item has the correct listType
      Transforms.setNodes(
        editor,
        { listType },
        {
          match: (node) =>
            !Editor.isEditor(node) &&
            Element.isElement(node) &&
            Element.isElementType(node, "list-item"),
          mode: "lowest",
        }
      );
    }
  },

  setFormatElement: (
    editor: DefaultEditor,
    options: { type: FormatElement["type"] }
  ) => {
    // const [match] = Editor.nodes(editor, {
    //   match: (node) =>
    //     !Editor.isEditor(node) &&
    //     Element.isElement(node) &&
    //     Element.isFormatElement(node),
    //     mode: 'all'
    // });

    Transforms.setNodes(editor, options, {
      match: (node) =>
        !Editor.isEditor(node) &&
        Element.isElement(node) &&
        Element.isFormatElement(node),
      // mode: "all",
    });
  },

  // toggleBlock: (editor: DefaultEditor, type: DefaultElement["type"]) => {
  //   const findBlockElement = (): [Node, Path] | undefined => {
  //     const [match] = Editor.nodes(editor, {
  //       match: (node) =>
  //         !Editor.isEditor(node) &&
  //         Element.isElement(node) &&
  //         Editor.isBlock(editor, { type }),
  //     });

  //     return match;
  //   };

  //   let match = findBlockElement();

  //   const isCurrentlyActive = !!match;
  //   const isList = isListType(type);
  //   const selection = editor.selection;

  //   log("toggleBlock", {
  //     match,
  //     type,
  //     isCurrentlyActive,
  //     isList,
  //     selection,
  //   });

  //   const setElementType = (type: DefaultElement["type"], nodeProps = {}) => {
  //     Transforms.setNodes(
  //       editor,
  //       { ...nodeProps, type },
  //       {
  //         match: (node) =>
  //           !Editor.isEditor(node) &&
  //           Element.isElement(node) &&
  //           Editor.isBlock(editor, node),
  //       }
  //     );
  //   };

  //   const wrapListItems = (listType: ListType) => {
  //     Transforms.wrapNodes(
  //       editor,
  //       { type: listType, children: [] },
  //       {
  //         match: (node) =>
  //           !Editor.isEditor(node) &&
  //           Element.isElement(node) &&
  //           Editor.isBlock(editor, node),
  //       }
  //     );
  //   };

  //   if (isList) {
  //     if (!isCurrentlyActive) {
  //       // convert elements to list items
  //       // if element already is list item then
  //       const listType = type as ListType;
  //       setElementType("list-item", { listType });
  //       wrapListItems(listType);
  //     } else {
  //     }
  //   } else {
  //     const nextType = isCurrentlyActive ? "paragraph" : type;
  //     setElementType(nextType);
  //   }
  // },

  getText: (editor: DefaultEditor) => {
    const { children } = editor;

    return children.map(Element.getText).join("");
  },

  getTextLength: (editor: DefaultEditor) => {
    const text = Editor.getText(editor);

    return text.length;
  },

  toJSON: (value: Descendant[]) => {
    return JSON.stringify(value);
  },

  fromJSON: (json: string): Descendant[] => {
    return JSON.parse(json);
  },

  getSelectedElement: <Output extends CustomElement>(
    editor: DefaultEditor
  ): NodeEntry<Output> | undefined => {
    const { selection } = editor;

    const [match] = selection
      ? Editor.nodes(editor, {
          at: selection,
          match: (node) => !Editor.isEditor(node) && Element.isElement(node),
          mode: "lowest",
        })
      : [];

    return match ? (match as NodeEntry<Output>) : undefined;
  },
};
