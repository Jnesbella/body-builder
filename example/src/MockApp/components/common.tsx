import * as React from "react";
import {
  Background,
  SizeProp,
  Text,
  theme,
  rounded,
  Surface,
} from "@jnesbella/body-builder";
import styled from "styled-components/native";

const ChipContainer = styled(Surface)`
  ${rounded({ roundness: theme.spacing * 2.5 })};
`;

export interface ChipProps extends Background {
  size?: SizeProp;
  label?: string;
  children?: React.ReactNode;
}

export function Chip({
  size = "large",
  label,
  children,
  background = theme.colors.accent,
}: ChipProps) {
  return (
    <ChipContainer background={background} spacingSize={[2.5, 1]}>
      {children || <Text.Label background={background}>{label}</Text.Label>}
    </ChipContainer>
  );
}
