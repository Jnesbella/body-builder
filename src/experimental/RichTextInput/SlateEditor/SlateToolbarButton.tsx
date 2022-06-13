import * as React from "react";
import { IconButton, IconButtonProps } from "../../../components";

export interface SlateToolbarButtonProps extends IconButtonProps {}

function SlateToolbarButton({ ...iconButtonProps }: SlateToolbarButtonProps) {
  return <IconButton {...iconButtonProps} />;
}

export default SlateToolbarButton;
