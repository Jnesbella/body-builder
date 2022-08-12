import * as React from "react";
import { LayoutChangeEvent, View } from "react-native";
import styled from "styled-components/native";

import Pressable, {
  PressableElement,
  PressableProps,
} from "../experimental/Pressable";
import {
  theme,
  ColorProp,
  darkenColor,
  appendLightTransparency,
  isColorTransparent,
  appendDarkTransparency,
  getContrastColor,
  isColorWhite,
  appendTransparency,
} from "../styles";
import { SizeProp } from "../types";
import { log } from "../utils";

import { PressableState } from "./componentsTypes";
import { LayoutBoxProps } from "./Layout";
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
  full,
  Full,
  greedy,
  Rounded,
} from "./styled-components";
import Text from "./Text";

const ButtonContainer = styled.View<
  Omit<LayoutBoxProps, "size"> & Rounded & Bordered & Background
>`
  ${background};
  ${color};
  ${outlineColor};
  ${flex};
  ${rounded};
  ${spacing};
  ${opacity};
  ${full};
  ${greedy};

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

export type ButtonElement = PressableElement;

export interface ButtonProps extends Omit<SpacingProps, "size">, Full {
  id?: PressableProps["id"];
  onPress?: PressableProps["onPress"];
  onPressCapture?: PressableProps["onPressCapture"];
  mode?: "contained" | "outlined" | "text";
  color?: ColorProp;
  title?: string;
  greedy?: boolean;
  disabled?: boolean;
  children?: React.ReactNode | ButtonRenderer;
  onLayout?: (event: LayoutChangeEvent) => void;
  selected?: boolean;
  active?: boolean;
  roundness?: number;
  background?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  size?: SizeProp;
  focusable?: PressableProps["focusable"];
  isHovered?: PressableProps["isHovered"];
  focusOn?: PressableProps["focusOn"];
  focusOnPress?: PressableProps["focusOnPress"];
  isFocused?: PressableProps["isFocused"];
  onHoverOver?: PressableProps["onHoverOver"];
  onHoverOut?: PressableProps["onHoverOut"];
  // focusOnPressCapture?: PressableProps["focusOnPressCapture"];
  // preventDefault?: PressableProps["preventDefault"];
  // stopPropagation?: PressableProps["stopPropagation"];
  // focusMode?: PressableProps["focusMode"];
  // onPointerDownCapture?: PressableProps["onPointerDownCapture"];
}

const Button = React.forwardRef<ButtonElement, ButtonProps>(
  (
    {
      id,
      title,
      onPress,
      mode = "text",
      color: colorProp,
      disabled: isDisabled,
      children,
      onLayout,
      selected: isSelected,
      active: isActive,
      background: backgroundProp,
      spacingSize = [1, 0],
      onPressCapture,
      size,
      fullWidth,
      onBlur,
      onFocus,
      focusable,
      isHovered,
      focusOn,
      focusOnPress,
      isFocused,
      onHoverOut,
      onHoverOver,
      greedy,
      // stopPropagation,
      // preventDefault,
      // focusOnPressCapture,
      // focusMode,
      // onPointerDownCapture,
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

      if (isPrimary) {
        return theme.colors.primary;
      }
    }, [isAccent, isPrimary]);

    const backgroundColor = React.useMemo(() => {
      if (backgroundProp) {
        return backgroundProp;
      }

      if (isSelected || isActive) {
        return theme.colors.accent;
      }

      if (isContained) {
        if (isDisabled) {
          return theme.colors.backgroundDisabled;
        }

        if (isPrimary || isAccent) {
          return themeColor;
        }

        return theme.colors.background;
      }

      // return isContained ? themeColor : theme.colors.transparent; // theme.colors.background
    }, [
      isContained,
      isDisabled,
      themeColor,
      isPrimary,
      isAccent,
      isSelected,
      backgroundProp,
      isActive,
    ]);

    const isBackgroundTransparent =
      !backgroundColor || isColorTransparent(backgroundColor);

    const isBackgroundWhite = !backgroundColor || isColorWhite(backgroundColor);

    const textColor = React.useMemo(() => {
      if (isContained) {
        return backgroundColor
          ? getContrastColor(backgroundColor)
          : theme.colors.text;
      }

      if (isDisabled) {
        return theme.colors.textDisabled;
      }

      if (isText || isOutlined) {
        return themeColor;
      }
    }, [isDisabled, isContained, themeColor, backgroundColor]);

    const borderColor = React.useMemo(() => {
      if (isOutlined) {
        return themeColor;
      }

      return theme.colors.transparent;
    }, [isOutlined, themeColor]);

    const renderChildren = (pressableState: PressableState) => {
      const borderColorHoveredDefault = themeColor || theme.colors.primary;

      const borderColorHoveredContrast = backgroundColor
        ? appendTransparency(getContrastColor(backgroundColor), 88)
        : undefined;

      const borderColorHovered =
        isBackgroundTransparent || isBackgroundWhite
          ? borderColorHoveredDefault
          : borderColorHoveredContrast;

      const buttonProps = {
        ...rest,
        ...pressableState,
        greedy,
        fullWidth,
        spacingSize,
        background: backgroundColor,
        borderColor:
          pressableState.hovered || pressableState.focused
            ? borderColorHovered
            : borderColor,
        opacity: pressableState.pressed ? 0.4 : 1,
        outlineColor: isPrimary ? theme.colors.accent : theme.colors.primary,
        color: textColor,
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
        id={id}
        greedy={greedy}
        fullWidth={fullWidth}
        ref={ref}
        onPress={onPress}
        disabled={isDisabled}
        onPressCapture={onPressCapture}
        onBlur={onBlur}
        onFocus={onFocus}
        focusable={focusable}
        isHovered={isHovered}
        isFocused={isFocused}
        focusOn={focusOn}
        focusOnPress={focusOnPress}
        onHoverOut={onHoverOut}
        onHoverOver={onHoverOver}
        // focusOnPressCapture={focusOnPressCapture}
        // stopPropagation={stopPropagation}
        // preventDefault={preventDefault}
        // focusMode={focusMode}
        // onPointerDownCapture={onPointerDownCapture}
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
