import * as React from "react";
import { ReactEditor, useSlate } from "slate-react";

import { FormatElement } from "../../../slateTypings";

import { Element } from "../customSlate";

import ImageElement from "./ImageElement";
import FormatElementText from "./FormatElementText";

import { ListElement, ListItem } from "./ListElement";

import { SlateElementProps } from "./slateElementTypes";

function SlateElement(props: SlateElementProps) {
  const { children, element, attributes } = props;

  const editor = useSlate();
  const path = ReactEditor.findPath(editor, element);

  if (Element.isElement(element) && Element.isFormatElement(element)) {
    const { type, textAlign } = props.element as FormatElement;

    return (
      <FormatElementText {...attributes} type={type} textAlign={textAlign}>
        {children}
      </FormatElementText>
    );
  }

  switch (element.type) {
    // case "block-quote":
    //   return <blockquote {...attributes}>{children}</blockquote>;

    case "image":
      return (
        <ImageElement {...attributes} element={element}>
          {children}
        </ImageElement>
      );

    case "bulleted-list":
    case "numbered-list":
    case "task-list":
      return <ListElement {...attributes}>{children}</ListElement>;

    case "list-item":
      return (
        <ListItem {...attributes} element={element}>
          {children}
        </ListItem>
      );
  }

  return <React.Fragment />;
}

export default SlateElement;
