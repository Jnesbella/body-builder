import * as React from "react";
import { LayoutChangeEvent, View } from "react-native";
import styled from "styled-components/native";

import { Pressable } from "../experimental/Pressable";
import {
  theme,
  ColorProp,
  darkenColor,
  appendLightTransparency,
  isColorTransparent,
  appendDarkTransparency,
  getContrastColor,
} from "../styles";

import { PressableState } from "./componentsTypes";
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
  opacity,
  Bordered,
} from "./styled-components";
import Text from "./Text";

const ButtonContainer = styled.View<Bordered & Greedy & SpacingProps>`
  ${background};
  ${color};
  ${outlineColor};
  ${flex};
  ${rounded};
  ${spacing};
  ${opacity};

  border-color: ${(props) => props.borderColor};
  border-width: ${theme.borderThickness}px;
  border-style: solid;
  justify-content: center;
  cursor: pointer;
`;

const ButtonText = styled(Text.Label).attrs({
  fontSize: FontSize.Normal,
})<Background | Color>`
  text-align: center;
`;

export type ButtonRenderer = (
  props: Background & Color & PressableState
) => React.ReactNode;

export interface ButtonProps extends SpacingProps {
  onPress?: () => void;
  onPressCapture?: () => void;
  mode?: "contained" | "outlined" | "text";
  color?: ColorProp;
  title?: string;
  greedy?: boolean;
  disabled?: boolean;
  children?: React.ReactNode | ButtonRenderer;
  onLayout?: (event: LayoutChangeEvent) => void;
  selected?: boolean;
  roundness?: number;
  background?: string;
}

const Button = React.forwardRef<HTMLDivElement, ButtonProps>(
  (
    {
      title,
      onPress,
      mode = "text",
      color: colorProp,
      disabled: isDisabled,
      children,
      onLayout,
      selected: isSelected,
      background: backgroundProp,
      spacingSize = [1, 0],
      onPressCapture,
      ...rest
    },
    ref
  ) => {
    const isPrimary = colorProp === "primary";
    const isAccent = colorProp === "accent";
    const isContained = mode === "contained";
    const isText = mode === "text";
    const isOutlined = mode === "outlined";

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

    const isBackgroundTransparent = isColorTransparent(backgroundColor);

    const textColor = React.useMemo(() => {
      if (isDisabled) {
        return theme.colors.textDisabled;
      }

      if (!isContained) {
        return themeColor;
      }
    }, [isDisabled, isContained, themeColor]);

    const borderColor = React.useMemo(() => {
      if (isOutlined) {
        return themeColor;
      }

      return theme.colors.transparent;
    }, [isOutlined, themeColor]);

    const renderChildren = (pressableState: PressableState) => {
      const backgroundPressed = isBackgroundTransparent
        ? appendLightTransparency(themeColor)
        : darkenColor(backgroundColor, 15);

      const borderColorHovered = isBackgroundTransparent
        ? appendDarkTransparency(themeColor)
        : darkenColor(backgroundColor, 15);

      const background = pressableState.pressed
        ? backgroundPressed
        : backgroundColor;

      const buttonProps = {
        ...rest,
        ...pressableState,
        // borderColor,
        spacingSize,
        // background: backgroundColor,
        borderColor: pressableState.hovered ? borderColorHovered : borderColor,
        // background: pressableState.pressed
        //   ? backgroundPressed
        //   : backgroundColor,
        background,
        opacity: pressableState.pressed ? 0.4 : 1,
        outlineColor: isPrimary ? theme.colors.accent : theme.colors.primary,
        color: getContrastColor(background),
      };

      const isCustomRender = typeof children === "function";
      if (isCustomRender) {
        const renderCustomButton = children as ButtonRenderer;
        return renderCustomButton(buttonProps);
      }

      return (
        <ButtonContainer {...buttonProps} onLayout={onLayout}>
          {children || (
            <ButtonText
              color={textColor}
              background={isContained && buttonProps.background}
            >
              {title}
            </ButtonText>
          )}
        </ButtonContainer>
      );
    };

    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        disabled={isDisabled}
        onPressCapture={onPressCapture}
      >
        {renderChildren}
      </Pressable>
    );
  }
);

type Button = typeof Button & {
  Text: typeof ButtonText;
  Container: typeof ButtonContainer;
};
(Button as Button).Text = ButtonText;
(Button as Button).Container = ButtonContainer;

export default Button as Button;
