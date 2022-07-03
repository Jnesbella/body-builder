import * as React from "react";
import styled from "styled-components/native";

import { theme } from "../styles";

import Icon, { IconProps } from "./Icon";
import Button, { ButtonProps } from "./Button";

export const ICON_BUTTON_SIZE = theme.spacing * 4.5;

const IconButtonContainer = styled(Button.Container).attrs({
  roundness: ICON_BUTTON_SIZE,
})`
  padding: 0;
  width: ${ICON_BUTTON_SIZE}px;
  height: ${ICON_BUTTON_SIZE}px;
  align-items: center;
`;

export interface IconButtonProps extends ButtonProps {
  icon: IconProps["icon"];
  background?: string;
}

function IconButton({ icon, ...rest }: IconButtonProps) {
  return (
    <Button {...rest}>
      {(buttonProps) => (
        <IconButtonContainer {...buttonProps}>
          <Icon icon={icon} color={buttonProps.color} />
        </IconButtonContainer>
      )}
    </Button>
  );
}

type IconButton = typeof IconButton & {
  Container: typeof IconButtonContainer;
};
(IconButton as IconButton).Container = IconButtonContainer;

export default IconButton as IconButton;
