import {
  Element as DefaultElement,
  Node,
  Editor as DefaultEditor,
  Descendant,
  Transforms,
  Text,
  Path,
  NodeEntry,
  Location,
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
    const isListElement = Editor.isListBlock(editor);
    const isActiveListElement = Editor.isListBlock(editor, listType);

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
        for (let match of listElementMatches) {
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
        }

        Editor.mergeListNodes(editor, listType);
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
      for (let match of formatElementMatches) {
        const [node, path] = match;

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
      }

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

      Editor.mergeListNodes(editor, listType);
    }
  },

  setFormatElement: (
    editor: DefaultEditor,
    {
      at,
      ...options
    }: {
      type?: FormatElement["type"];
      textAlign?: FormatElement["textAlign"];
      at?: Location;
    }
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
      at,
    });
  },

  mergeListNodes: (
    editor: DefaultEditor,
    listType: ListElement["type"]
    // { at }: { at: Path }
  ) => {
    const matches = Editor.nodes(editor, {
      match: (node) =>
        !Editor.isEditor(node) &&
        Element.isElement(node) &&
        Element.isListElement(node, listType),
      // mode: "lowest",
    });

    log("-----");

    log("mergeListNodes: ", { matches, listType });

    for (let match of matches) {
      const [node, path] = match;

      log(".");
      log("match: ", { node, path });

      if (Node.has(editor, Path.next(path))) {
        const [nextSibling, nextSiblingPath] = Editor.node(
          editor,
          Path.next(path)
        );

        const isNextSiblingList = Element.isListElement(nextSibling, listType);

        log({ isNextSiblingList });

        if (isNextSiblingList) {
          Transforms.mergeNodes(editor, { at: nextSiblingPath });
        }
      }

      if (Path.hasPrevious(path)) {
        // if (Node.has(editor, Path.previous(path))) {
        const [prevSibling, previousSiblingPath] = Editor.node(
          editor,
          Path.previous(path)
        );
        const isPrevSiblingList = Element.isListElement(prevSibling, listType);

        log({ isPrevSiblingList });

        if (isPrevSiblingList) {
          Transforms.mergeNodes(editor, { at: path });
        }
      }
    }
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
    const text = children.map(Element.getText).join("\b");

    return text;
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

  canUndo: (editor: DefaultEditor) => {
    return editor.history.undos.length > 0;
  },

  canRedo: (editor: DefaultEditor) => {
    return editor.history.redos.length > 0;
  },
};
