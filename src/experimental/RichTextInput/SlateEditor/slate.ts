import { get } from "lodash";
import * as React from "react";
import {
  Element as DefaultElement,
  Node,
  Editor as DefaultEditor,
  Descendant,
  Transforms,
} from "slate";
import { RenderElementProps } from "slate-react";

import { ListType, MarkType } from "../../../typings-slate";

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

  isBlock: (editor: DefaultEditor, type: DefaultElement["type"]) => {
    const nodes = Editor.nodes(editor, {
      match: (node) => {
        const isEditor = Editor.isEditor(node);
        const isElementOfType = Element.isType(node, type);

        return !isEditor && isElementOfType;
      },
    });

    return !!get(nodes, "0");
  },

  toggleBlock: (editor: DefaultEditor, type: DefaultElement["type"]) => {
    const isActive = Editor.isBlock(editor, type);
    const isList = isListType(type);

    Transforms.unwrapNodes(editor, {
      match: (node) => {
        const isEditor = Editor.isEditor(node);
        const isElement = Element.isElement(node);
        // const isList = SlateElement.isList(node);

        return !isEditor && isElement;
        // return !isEditor && (isElement || isList);
      },
      split: true,
    });

    const props: Partial<DefaultElement> = {
      type,
    };

    if (isActive) {
      props.type = "paragraph";
    } else if (isList) {
      props.type = "list-item";
    }

    Transforms.setNodes(editor, props as any);

    if (!isActive && isList) {
      Transforms.wrapNodes(editor, {
        type: type as ListType,
        children: [],
      });
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
