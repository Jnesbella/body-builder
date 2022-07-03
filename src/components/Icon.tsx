// https://fontawesome.com/icons

import * as React from "react";
// import styled from "styled-components/native";
import {
  Icon as DefaultIcon,
  Props as DefaultIconProps,
} from "react-bootstrap-icons";

import { theme } from "../styles";
// import { log } from "../utils";

import {
  SpacingProps,
  Background,
  // color,
  // background,
  // Color,
} from "./styled-components";
import Layout from "./Layout";

// const StyledIconNative = styled(Layout.Box)<Background & Color & SpacingProps>`
//   ${color};
//   ${background};
// `;

// export type IconProps = React.ComponentProps<typeof FontAwesomeNative> &
//   Background

export interface IconProps
  extends Background,
    Omit<DefaultIconProps, "spacing">,
    SpacingProps {
  icon: DefaultIcon;
  size?: number;
}

function Icon({
  size = theme.spacing * 2.5,
  // color,
  icon: Icon,
  ...iconProps
}: IconProps) {
  return (
    // <StyledIconNative>
    <Icon {...iconProps} size={size} />
    // </StyledIconNative>
  );
}

export default Icon;
