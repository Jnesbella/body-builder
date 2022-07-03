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
} from "slate";
import { RenderElementProps } from "slate-react";

import { CustomElement, ListType, MarkType } from "../../../typings-slate";
import { log } from "../../../utils";

import { LIST_TYPES } from "./slateConstants";
import { isListType } from "./slateUtils";

export interface SlateElementProps extends RenderElementProps {}

export const Element = {
  ...DefaultElement,

  isType: (node: Node, type: DefaultElement["type"]) => {
    return Element.isElementType(node, type);
    // return Element.isElement(node) && node.type === type;
  },

  isList: (node: Node) => {
    return LIST_TYPES.some((type) => Element.isType(node, type));
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

  isBlock: (editor: DefaultEditor, payload: Pick<DefaultElement, "type">) => {
    const [match] = Editor.nodes(editor, {
      match: (node) => {
        const isEditor = Editor.isEditor(node);
        const isElementOfType = Element.isType(node, payload.type);

        return !isEditor && isElementOfType;
      },
    });

    log("isBlock", { match });

    return !!match;
  },

  toggleBlock: (editor: DefaultEditor, type: DefaultElement["type"]) => {
    const findBlockElement = (): [Node, Path] | undefined => {
      const [match] = Editor.nodes(editor, {
        match: (node) =>
          !Editor.isEditor(node) &&
          Element.isElement(node) &&
          Editor.isBlock(editor, { type }),
      });

      return match;
    };

    let match = findBlockElement();

    const isCurrentlyActive = !!match;
    const isList = isListType(type);
    const selection = editor.selection;

    log("toggleBlock", {
      match,
      type,
      isCurrentlyActive,
      isList,
      selection,
    });

    const setElementType = (type: DefaultElement["type"], nodeProps = {}) => {
      Transforms.setNodes(
        editor,
        { ...nodeProps, type },
        {
          match: (node) =>
            !Editor.isEditor(node) &&
            Element.isElement(node) &&
            Editor.isBlock(editor, node),
        }
      );
    };

    const wrapListItems = (listType: ListType) => {
      Transforms.wrapNodes(
        editor,
        { type: listType, children: [] },
        {
          match: (node) =>
            !Editor.isEditor(node) &&
            Element.isElement(node) &&
            Editor.isBlock(editor, node),
        }
      );
    };

    if (isList) {
      if (!isCurrentlyActive) {
        // convert elements to list items
        // if element already is list item then
        const listType = type as ListType;
        setElementType("list-item", { listType });
        wrapListItems(listType);
      } else {
      }
    } else {
      const nextType = isCurrentlyActive ? "paragraph" : type;
      setElementType(nextType);
    }
  },

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
};
