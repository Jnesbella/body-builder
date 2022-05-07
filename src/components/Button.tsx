import * as React from "react";
import { LayoutChangeEvent, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

import { theme, ColorProp } from "../styles";

import {
  background,
  color,
  flex,
  FontSize,
  Greedy,
  outlineColor,
  rounded,
  Background,
  Color,
  spacing,
  SpacingProps,
} from "./styled-components";
import Text from "./Text";

const ButtonContainer = styled(TouchableOpacity)<
  {
    background: string;
    borderColor: string;
  } & Greedy &
    SpacingProps
>`
  ${background};
  ${color};
  ${outlineColor};
  ${flex};
  ${rounded};
  ${spacing};

  border-color: ${(props) => props.borderColor};
  border-width: ${theme.borderThickness}px;
  border-style: solid;
  justify-content: center;
`;

const ButtonText = styled(Text.Label).attrs({
  fontSize: FontSize.Normal,
})<Background | Color>`
  text-align: center;
`;

export type ButtonChildren = (props: Background & Color) => React.ReactNode;

export interface ButtonProps extends SpacingProps {
  onPress?: () => void;
  mode?: "contained" | "outlined" | "text";
  color?: ColorProp;
  title?: string;
  greedy?: boolean;
  disabled?: boolean;
  children?: React.ReactNode | ButtonChildren;
  onLayout?: (event: LayoutChangeEvent) => void;
  selected?: boolean;
  roundness?: number;
  background?: string;
}

// type Button = React.ForwardRefExoticComponent<
//   ButtonProps & React.RefAttributes<TouchableOpacity>
// > & { Text: typeof ButtonText };

const Button = React.forwardRef<TouchableOpacity, ButtonProps>(
  (
    {
      title,
      onPress,
      mode = "text",
      color: colorProp,
      greedy,
      disabled: isDisabled,
      children,
      onLayout,
      selected: isSelected,
      background: backgroundProp,
      spacingSize = [1, 0],
      ...rest
    },
    ref
  ) => {
    // const isPrimary = colorProp === 'primary'
    const isAccent = colorProp === "accent";
    const isContained = mode === "contained";
    const isText = mode === "text";

    const themeColor = React.useMemo(() => {
      if (isAccent) {
        return theme.colors.accent;
      }

      return theme.colors.primary;
    }, [isAccent]);

    const backgroundColor = React.useMemo(() => {
      if (backgroundProp) {
        return backgroundProp;
      }

      if (isSelected) {
        return theme.colors.accentLight;
      }

      if (isDisabled) {
        return theme.colors.backgroundDisabled;
      }

      return isContained ? themeColor : theme.colors.transparent; // theme.colors.background
    }, [isContained, isDisabled, themeColor, isSelected, backgroundProp]);

    const textProps = React.useMemo(() => {
      if (isDisabled) {
        return { color: theme.colors.textDisabled };
      }

      return isContained
        ? { background: backgroundColor }
        : { color: themeColor };
    }, [isDisabled, isContained, backgroundColor, themeColor]);

    const borderColor = React.useMemo(() => {
      if (backgroundProp) {
        return backgroundProp;
      }

      if (isDisabled) {
        return backgroundColor;
      }

      return isText ? backgroundColor : themeColor;
    }, [isText, isDisabled, backgroundColor, themeColor, backgroundProp]);

    const renderChildren = () => {
      if (children && typeof children === "function") {
        return (children as ButtonChildren)(textProps);
      }

      return children || <ButtonText {...textProps}>{title}</ButtonText>;
    };

    return (
      <ButtonContainer
        ref={ref}
        onPress={onPress}
        background={backgroundColor}
        borderColor={borderColor}
        greedy={greedy}
        disabled={isDisabled}
        onLayout={onLayout}
        spacingSize={spacingSize}
        {...rest}
      >
        {renderChildren()}
      </ButtonContainer>
    );
  }
);

type Button = typeof Button & { Text: typeof ButtonText };
(Button as Button).Text = ButtonText;

export default Button as Button;
