import * as React from "react";
import * as Icons from "react-bootstrap-icons";
import { Transforms, Selection } from "slate";
import styled from "styled-components";

import { log } from "../../../utils";

import RichTextToolbarItem, {
  RichTextToolbarItemProps,
} from "./RichTextToolbarItem";

const Input = styled.input`
  display: none;
`;

export interface InsertImageButtonProps
  extends Omit<RichTextToolbarItemProps, "icon" | "onPress" | "label"> {}

function InsertImageButton(props: InsertImageButtonProps) {
  const { editor } = props;
  const { selection } = editor || {};

  const selectionCache = React.useRef<Selection | null>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const validateFile = (file: File) => {
    const sizeInBytes = file.size;
    const sizeInKb = sizeInBytes / 1024;
    const sizeInMb = sizeInKb / 1024;

    if (sizeInMb > 5) {
      return "Image size is too big. Max 5MB.";
    }
  };

  const fileToUrl = (file: File, timeoutInMS = 5000) => {
    const timeoutPromise = new Promise<string>((_resolve, reject) => {
      setTimeout(() => {
        reject();
      }, timeoutInMS);
    });

    const readImagePromise = new Promise<string>((resolve, _reject) => {
      const reader = new FileReader();

      reader.addEventListener(
        "load",
        () => {
          // convert image file to base64 string
          const url = reader.result;
          resolve(url as string);
        },
        false
      );

      reader.readAsDataURL(file);
    });

    return Promise.race([timeoutPromise, readImagePromise]);
  };

  return (
    <React.Fragment>
      <RichTextToolbarItem
        {...props}
        icon={Icons.Image}
        onPress={() => {
          inputRef.current?.click();
        }}
        label="Insert image"
        onPressCapture={() => {
          selectionCache.current = selection || selectionCache.current;
        }}
      />

      <Input
        ref={inputRef}
        title="insert image"
        type="file"
        accept="image/*"
        onChange={async (event) => {
          const { files } = event.target;
          const image = files?.item(0);

          if (!image) return;

          const error = validateFile(image);
          if (editor && !error) {
            const url = await fileToUrl(image);
            const { current: selectionOrNull } = selectionCache;
            const at = selectionOrNull ? selectionOrNull : undefined;

            Transforms.insertNodes(
              editor,
              [
                {
                  type: "image",
                  src: url,
                  children: [{ text: "" }],
                },
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ],
              { at }
            );
          }
        }}
      />
    </React.Fragment>
  );
}

export default InsertImageButton;
