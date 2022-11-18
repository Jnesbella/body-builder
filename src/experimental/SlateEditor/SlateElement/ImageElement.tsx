import * as React from "react";
import { ReactEditor, useSlate } from "slate-react";
import styled from "styled-components";
import { pick } from "lodash";
import { BasePoint, Path, Transforms } from "slate";

import { InputOutline } from "../../../components";
import { ImageElement } from "../../../slateTypings";

import Pressable, { PressableActions, PressableState } from "../../Pressable";

import { SlateElementProps } from "./slateElementTypes";

export const Image = styled.img<{ width: number }>`
  max-width: 100%;
  width: ${(props) => props.width}px;
`;

type ImageElementProps = SlateElementProps["attributes"] & {
  element: ImageElement;
  children: SlateElementProps["children"];
};

const ImageElement = React.forwardRef<any, ImageElementProps>(
  ({ children, element, ...attributes }, ref) => {
    const editor = useSlate();
    const path = ReactEditor.findPath(editor, element);
    const { selection } = editor;
    const { anchor, focus } = selection || {};

    const isDescendant = (point?: BasePoint) =>
      point?.path && Path.isDescendant(point.path, path);

    const isSelected = isDescendant(anchor) || isDescendant(focus);

    console.log({ path, selection, isSelected });

    return (
      <span {...attributes} ref={ref}>
        <div contentEditable={false} style={{ display: "inline-block" }}>
          <Pressable
            isFocused={isSelected || false}
            // focusOn="none"
            focusable={false}
            focusOnPress={false}
            onPress={() => Transforms.select(editor, path)}
          >
            {(pressableProps: PressableState & PressableActions) => (
              <InputOutline {...pressableProps} spacingSize={0}>
                <Image src={element.src} width={element.width || 200} />
              </InputOutline>
            )}
          </Pressable>
        </div>
        {children}
      </span>
    );
  }
);

export default ImageElement;
