import * as React from "react";
import styled from "styled-components/native";

import { theme } from "../styles";

import Icon, { IconProps } from "./Icon";
import Button, { ButtonElement, ButtonProps } from "./Button";
import { SizeProp } from "../types";
import { getColor } from "./styled-components";

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

const IconButton = React.forwardRef<ButtonElement, IconButtonProps>(
  ({ icon, size, ...rest }, ref) => {
    return (
      <Button {...rest} ref={ref}>
        {(buttonProps) => {
          return (
            <IconButtonContainer {...buttonProps} size={size}>
              <Icon
                icon={icon}
                fill={getColor(buttonProps)}
                size={size === "small" ? Icon.size.small : undefined}
              />
            </IconButtonContainer>
          );
        }}
      </Button>
    );
  }
);

type IconButton = typeof IconButton & {
  Container: typeof IconButtonContainer;
};
(IconButton as IconButton).Container = IconButtonContainer;

export default IconButton as IconButton;
