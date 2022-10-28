import * as React from "react";
import styled from "styled-components/native";
import { Animated, Easing } from "react-native";
import { get } from "lodash";
import { LayoutRectangle } from "react-native";

import { theme } from "../../styles";

import {
  background,
  Flexible,
  Full,
  rounded,
  Space,
  Background,
  Color,
  Rounded,
} from "../styled-components";
import Layout from "../Layout";
import Button from "../Button";

const navButtonWidth = theme.spacing * 12;

const ToggleInputContainer = styled(Layout.Box)<Rounded & Background>`
  ${rounded};
  ${background};
`;

const ToggleInputButton = styled(Button).attrs({
  // background: theme.colors.transparent,
  // borderColor: theme.colors.transparent
})`
  min-width: ${navButtonWidth}px;
`;

const ToggleInputIndicator = styled(Animated.View).attrs(
  ({ background = theme.colors.primaryLight }: Background) => ({
    background,
  })
)<{ height: number } & Background & Rounded>`
  ${background};
  ${rounded};

  height: ${(props) => props.height}px;
  position: absolute;
`;

export type ToggleInputProps<T extends string = string> = {
  value?: T;
  onChange?: (value: T) => void;
  options?: T[];
  renderLabel?: (option: T) => string;
  layout?: "column" | "row";
  disabled?: boolean;
} & Full &
  Flexible &
  Background &
  Color;

function ToggleInput<T extends string = string>({
  value,
  onChange,
  options,
  renderLabel,
  layout = "row",
  disabled,
  background,
  ...rest
}: ToggleInputProps<T>) {
  const [measurements, setMeasurements] = React.useState<
    Record<string, LayoutRectangle>
  >({});
  const isRow = layout === "row";
  const Wrapper = React.useCallback(
    ({ children }: { children?: React.ReactNode }) =>
      isRow ? (
        <Layout.Row fullHeight>{children}</Layout.Row>
      ) : (
        <Layout.Column>{children}</Layout.Column>
      ),
    [isRow]
  );

  const indicatorLeft = React.useMemo(() => {
    return value
      ? get(measurements, [value, isRow ? "x" : "y"], theme.spacing)
      : theme.spacing;
  }, [value, measurements, isRow]);

  const buttonHeight = React.useMemo(() => {
    return value ? get(measurements, [value, "height"], 0) : theme.spacing;
  }, [value, measurements]);

  const buttonWidth = React.useMemo(() => {
    return value ? get(measurements, [value, "width"], 0) : theme.spacing;
  }, [value, measurements]);

  const { current: slideAnim } = React.useRef(
    new Animated.Value(indicatorLeft)
  );

  const { current: growAnim } = React.useRef(new Animated.Value(buttonWidth));

  React.useEffect(() => {
    const timing = Animated.timing(slideAnim, {
      toValue: indicatorLeft,
      duration: 66,
      easing: Easing.ease,
      useNativeDriver: false,
    });

    timing.start();

    return () => {
      timing.stop();
    };
  }, [slideAnim, indicatorLeft]);

  React.useEffect(() => {
    const timing = Animated.timing(growAnim, {
      toValue: isRow ? buttonWidth : buttonHeight,
      duration: 66,
      easing: Easing.ease,
      useNativeDriver: false,
    });

    timing.start();

    return () => {
      timing.stop();
    };
  }, [growAnim, buttonWidth, buttonHeight, isRow]);

  return (
    <ToggleInputContainer {...rest}>
      <Wrapper>
        {!!value && (
          <ToggleInputIndicator
            background={background}
            style={
              isRow
                ? { left: slideAnim, width: growAnim }
                : { top: slideAnim, width: buttonWidth }
            }
            height={buttonHeight}
          />
        )}

        {options?.map((option, i) => (
          <React.Fragment key={option}>
            {i > 0 && <Space />}

            <ToggleInputButton
              disabled={disabled}
              title={renderLabel?.(option) || option}
              onPress={() => onChange?.(option)}
              mode="text"
              onLayout={(event) => {
                const { layout } = event.nativeEvent || {};
                setMeasurements((prevMeasurements) => ({
                  ...prevMeasurements,
                  [option]: layout,
                }));
              }}
            />
          </React.Fragment>
        ))}
      </Wrapper>
    </ToggleInputContainer>
  );
}

export default ToggleInput;
