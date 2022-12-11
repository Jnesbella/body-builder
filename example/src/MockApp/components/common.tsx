import * as React from "react";
import {
  Background,
  SizeProp,
  Text,
  theme,
  rounded,
  Surface,
  Pressable,
} from "@jnesbella/body-builder";
import styled from "styled-components/native";

const ChipContainer = styled(Surface)<{ height: number }>`
  ${(props) => rounded({ roundness: props.height / 2 })};

  height: ${(props) => props.height}px;
  justify-content: center;
  align-items: center;
`;

export interface ChipProps extends Background {
  size?: SizeProp;
  label?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  fullWidth?: boolean;
}

export function Chip({
  size: sizeProp = "large",
  label,
  children,
  background = theme.colors.accent,
  onPress,
  fullWidth,
}: ChipProps) {
  const size = (() => {
    if (sizeProp === "small") {
      return 3;
    }

    return 4;
  })();

  const height = theme.spacing * size;

  return (
    <Pressable onPress={onPress} fullWidth={fullWidth}>
      <ChipContainer
        background={background}
        spacingSize={[size / 2, 0]}
        height={height}
        fullWidth={fullWidth}
      >
        {children || <Text.Label background={background}>{label}</Text.Label>}
      </ChipContainer>
    </Pressable>
  );
}
