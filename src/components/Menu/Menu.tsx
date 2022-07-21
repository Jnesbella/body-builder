import * as React from "react";
import styled from "styled-components/native";
import { theme } from "../../styles";
import Button, { ButtonProps } from "../Button";

import Layout from "../Layout";
import {
  FontWeight,
  fontWeight,
  full,
  rounded,
  shadow,
  zIndex,
} from "../styled-components";
import Text from "../Text";

const MenuContainer = styled(Layout.Column)`
  ${rounded};
  ${full};
  ${shadow};

  background: ${theme.colors.background};
  max-width: ${theme.spacing * 30}px;
  max-height: ${theme.spacing * 40}px;
  elevation: 1;
`;

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

export interface MenuProps {
  children: React.ReactNode;
}

function Menu({ children }: MenuProps) {
  return <MenuContainer>{children}</MenuContainer>;
}

Menu.Item = MenuItem;
Menu.Text = MenuText;

export default Menu;
