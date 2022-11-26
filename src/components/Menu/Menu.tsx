import * as React from "react";
import styled from "styled-components/native";

import { theme } from "../../styles";

import Button, { ButtonProps } from "../Button";
import {
  ElevationProps,
  FontWeight,
  fontWeight,
  rounded,
  Rounded,
} from "../styled-components";
import Surface from "../Surface";
import Text from "../Text";

const MenuContainer = styled(Surface)<Rounded>`
  ${rounded};

  background: ${theme.colors.background};
`;
// max-width: ${theme.spacing * 30}px;
// max-height: ${theme.spacing * 40}px;

const MenuText = styled(Text).attrs<{ isSelected?: boolean }>(
  ({ isSelected }) => ({
    fontWeight: isSelected ? FontWeight.Bold : FontWeight.Normal,
  })
)`
  ${fontWeight};
`;

export interface MenuItemProps extends Omit<ButtonProps, "children"> {
  children?: React.ReactNode;
}

function MenuItem({
  selected,
  children,
  title,
  ...buttonProps
}: MenuItemProps) {
  return (
    <Button {...buttonProps} selected={selected}>
      {children || <MenuText isSelected={selected}>{title}</MenuText>}
    </Button>
  );
}

export interface MenuProps extends ElevationProps {
  children: React.ReactNode;
}

function Menu({ children, ...rest }: MenuProps) {
  return <MenuContainer {...rest}>{children}</MenuContainer>;
}

Menu.Item = MenuItem;
Menu.Text = MenuText;

export default Menu;
