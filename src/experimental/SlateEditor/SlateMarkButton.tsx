import * as React from "react";
import { useSlate } from "slate-react";

import { IconButtonProps as DefaultIconButtonProps } from "../../components";
import { MarkType } from "../../slateTypings";
import { log } from "../../utils";

import { Editor } from "./customSlate";
import SlateButton, { SlateButtonProps } from "./SlateButton";
import { MARK_ICONS } from "./slateConstants";

export interface SlateMarkButtonProps extends SlateButtonProps {
  mark: MarkType;
}

function SlateMarkButton({
  mark,
  icon: iconProp,
  ...iconButtonProps
}: SlateMarkButtonProps) {
  const editor = useSlate();

  const icon = iconProp || MARK_ICONS[mark];

  const isActive = Editor.hasMark(editor, mark);

  log("SlateMarkButton", { mark, isActive });

  return (
    <SlateButton
      {...iconButtonProps}
      active={isActive}
      onPress={() => Editor.toggleMark(editor, mark)}
      icon={icon}
    />
  );
}

export default SlateMarkButton;
