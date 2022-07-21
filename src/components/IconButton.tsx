import * as React from "react";
import styled from "styled-components/native";

import { theme } from "../styles";

import Icon, { IconProps } from "./Icon";
import Button, { ButtonProps } from "./Button";
import { SizeProp } from "../types";

export const ICON_BUTTON_SIZE = theme.spacing * 4.5;
export const ICON_BUTTON_SIZE_SMALL = theme.spacing * 3;

const IconButtonContainer = styled(Button.Container).attrs({
  roundness: ICON_BUTTON_SIZE,
})<{ size?: SizeProp }>`
  padding: 0;
  align-items: center;

  width: ${({ size }) =>
    size === "small" ? ICON_BUTTON_SIZE_SMALL : ICON_BUTTON_SIZE}px;

  height: ${({ size }) =>
    size === "small" ? ICON_BUTTON_SIZE_SMALL : ICON_BUTTON_SIZE}px;
`;

export interface IconButtonProps extends ButtonProps {
  icon: IconProps["icon"];
  background?: string;
}

function IconButton({ icon, size, ...rest }: IconButtonProps) {
  return (
    <Button {...rest}>
      {(buttonProps) => (
        <IconButtonContainer {...buttonProps} size={size}>
          <Icon
            icon={icon}
            color={buttonProps.color}
            size={size === "small" ? theme.spacing * 2 : undefined}
          />
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
