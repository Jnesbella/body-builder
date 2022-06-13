import * as React from "react";
import { useSlate } from "slate-react";
import { Element } from "slate";
import styled from "styled-components/native";

import {
  IconButton as DefaultIconButton,
  IconButtonProps as DefaultIconButtonProps,
} from "../../../components";

import SlateEditor from "./SlateEditor";
import { Editor } from "./slate";

const IconButton = styled(DefaultIconButton)<{ isActive?: boolean }>``;

interface BlockButtonProps extends DefaultIconButtonProps {
  block: Element["type"];
  tooltip?: React.ReactNode;
}

function BlockButton({
  block,
  disabled,
  ...iconButtonProps
}: BlockButtonProps) {
  const editor = useSlate();

  return (
    <IconButton
      {...iconButtonProps}
      disabled={disabled}
      isActive={Editor.isBlock(editor, block)}
      onPress={() => {
        Editor.toggleBlock(editor, block);
      }}
    />
  );
}

export default BlockButton;
