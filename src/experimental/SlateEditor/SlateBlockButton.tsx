import * as React from "react";
import { Element } from "slate";
import { useSlate } from "slate-react";

import { Editor } from "./customSlate";
import SlateButton, { SlateButtonProps } from "./SlateButton";
import { BLOCK_ICONS } from "./slateConstants";

export interface SlateBlockButtonProps extends SlateButtonProps {
  block: Element["type"];
}

function SlateBlockButton({
  block,
  icon: iconProp,
  ...iconButtonProps
}: SlateBlockButtonProps) {
  const editor = useSlate();

  const icon = iconProp || BLOCK_ICONS[block];

  const isActive = Editor.isBlock(editor, { type: block });

  const toggleBlock = () => {
    switch (block) {
      case "bulleted-list":
      case "numbered-list":
      case "task-list":
        return Editor.toggleListElement(editor, block);
    }
  };

  return (
    <SlateButton
      {...iconButtonProps}
      active={isActive}
      icon={icon}
      onPress={toggleBlock}
    />
  );
}

export default SlateBlockButton;
