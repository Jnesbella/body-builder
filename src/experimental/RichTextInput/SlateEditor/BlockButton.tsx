import * as React from "react";
import { ReactEditor, useSlate } from "slate-react";
import { Element } from "slate";
import styled from "styled-components/native";

import {
  IconButton as DefaultIconButton,
  IconButtonProps as DefaultIconButtonProps,
} from "../../../components";

// import SlateEditor from "./SlateEditor";
import { Editor } from "./customSlate";
import SlateButton from "./SlateButton";

// const IconButton = styled(DefaultIconButton)<{ isActive?: boolean }>``;

export interface BlockButtonProps extends DefaultIconButtonProps {
  block: Element["type"];
  tooltip?: React.ReactNode;
  isActive?: boolean;
}

function BlockButton({
  block,
  disabled,
  ...iconButtonProps
}: BlockButtonProps) {
  const editor = useSlate();

  return (
    // <IconButton
    //   {...iconButtonProps}
    //   disabled={disabled}
    //   isActive={Editor.isBlock(editor, block)}
    //   onPress={() => {
    //     Editor.toggleBlock(editor, block);
    //   }}
    // />

    <SlateButton
      disabled={disabled}
      // isActive={Editor.isBlock(editor, { type: block })}
      // onPress={() => Editor.toggleBlock(editor, block)}
      {...iconButtonProps}
    />
  );
}

export default BlockButton;
