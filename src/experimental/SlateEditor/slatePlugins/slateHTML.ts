import { Transforms } from "slate";
import { jsx } from "slate-hyperscript";

import { CustomEditor } from "../../../slateTypings";
import { log } from "../../../utils";

import { ELEMENT_TAGS, TEXT_TAGS } from "../slateConstants";

export const deserializeHTML = (el: HTMLElement) => {
  if (el.nodeType === 3) {
    return el.textContent;
  } else if (el.nodeType !== 1) {
    return null;
  } else if (el.nodeName === "BR") {
    // return "\n";
    const attrs = ELEMENT_TAGS.P();
    return jsx("element", attrs, [{ text: "" }]);
  }

  const { nodeName } = el;
  let parent: HTMLElement | ChildNode = el;

  if (
    nodeName === "PRE" &&
    el.childNodes[0] &&
    el.childNodes[0].nodeName === "CODE"
  ) {
    parent = el.childNodes[0];
  }

  let children: any = Array.from(parent.childNodes)
    .map((node) => deserializeHTML(node as HTMLElement))
    .flat();

  if (children.length === 0) {
    children = [{ text: "" }];
  }

  if (el.nodeName === "BODY") {
    return jsx("fragment", {}, children);
  }

  if (ELEMENT_TAGS[nodeName]) {
    const attrs = ELEMENT_TAGS[nodeName](el);
    return jsx("element", attrs, children);
  }

  if (TEXT_TAGS[nodeName]) {
    const attrs = TEXT_TAGS[nodeName](el);
    return children.map((child: any) => jsx("text", attrs, child));
  }

  return children;
};

export function withHTML(editor: CustomEditor) {
  const { insertData, isInline, isVoid } = editor;

  editor.isInline = (element) => {
    return element.type === "link" ? true : isInline(element);
  };

  // editor.isVoid = (element) => {
  //   return element.type === "image" ? true : isVoid(element);
  // };

  editor.insertData = (data) => {
    const html = data.getData("text/html");

    if (html) {
      const parsed = new DOMParser().parseFromString(html, "text/html");
      const fragment = deserializeHTML(parsed.body);

      Transforms.insertFragment(editor, fragment);
      return;
    }

    insertData(data);
  };

  return editor;
}
