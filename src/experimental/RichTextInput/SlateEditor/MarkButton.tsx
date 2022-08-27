import * as React from "react";
import { useSlate } from "slate-react";
import styled from "styled-components/native";

import {
  IconButton as DefaultIconButton,
  IconButtonProps as DefaultIconButtonProps,
} from "../../../components";
import { MarkType } from "../../../typings-slate";
import { Editor } from "./customSlate";

import SlateButton from "./SlateButton";

export interface MarkButtonProps extends DefaultIconButtonProps {
  mark: MarkType;
  tooltip?: React.ReactNode;
}

function MarkButton({ mark, disabled, ...iconButtonProps }: MarkButtonProps) {
  const editor = useSlate();

  return (
    <SlateButton
      disabled={disabled}
      isActive={Editor.hasMark(editor, mark)}
      onPress={() => Editor.toggleMark(editor, mark)}
      {...iconButtonProps}
    />
  );
}

export default MarkButton;
