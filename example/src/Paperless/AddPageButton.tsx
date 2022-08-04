import * as React from "react";
import { IconButton } from "@jnesbella/body-builder";
import * as Icons from "react-bootstrap-icons";

export interface AddPageButtonProps {
  onAddPage: () => void;
}

function AddPageButton({ onAddPage }: AddPageButtonProps) {
  return <IconButton icon={Icons.Plus} onPress={onAddPage} />;
}

export default AddPageButton;
