import * as React from "react";
import { ReactEditor, useSlate } from "slate-react";
import styled from "styled-components/native";

import {
  Background,
  IconButton as DefaultIconButton,
  IconButtonProps as DefaultIconButtonProps,
} from "../../../components";
import { theme } from "../../../styles";

const IconButton = styled(DefaultIconButton)<
  { isActive?: boolean } & Background
>`
  background-color: ${(props) =>
    props.isActive ? theme.colors.primaryLight : props.background};
`;

export interface SlateButtonProps extends DefaultIconButtonProps {
  tooltip?: React.ReactNode;
  isActive?: boolean;
}

function SlateButton({ onPress, ...iconButtonProps }: SlateButtonProps) {
  const editor = useSlate();

  return (
    <IconButton
      {...iconButtonProps}
      onPress={() => {
        onPress?.();
        ReactEditor.focus(editor);
      }}
    />
  );
}

export default SlateButton;
