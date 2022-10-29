import * as React from "react";
import { ReactEditor, useSlate } from "slate-react";
import styled from "styled-components/native";

import {
  Background,
  IconButton,
  IconButtonProps as DefaultIconButtonProps,
} from "../../components";
import { theme } from "../../styles";

export interface SlateButtonProps extends Omit<DefaultIconButtonProps, "icon"> {
  tooltip?: React.ReactNode;
  icon?: DefaultIconButtonProps["icon"];
}

function SlateButton({
  onPress,
  size = "small",
  icon,
  ...iconButtonProps
}: SlateButtonProps) {
  const editor = useSlate();

  if (!icon) {
    return null;
  }

  return (
    <IconButton
      {...iconButtonProps}
      onPress={() => {
        onPress?.();
        ReactEditor.focus(editor);
      }}
      size={size}
      focusOn="none"
      focusable={false}
      icon={icon}
    />
  );
}

export default SlateButton;
