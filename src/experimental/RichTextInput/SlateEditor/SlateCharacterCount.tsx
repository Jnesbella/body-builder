import React from "react";
import { Text } from "../../../components";

export interface SlateCharacterCountProps {
  maxLength?: number;
  characterCount?: number;
}

function SlateCharacterCount({
  maxLength,
  characterCount,
}: SlateCharacterCountProps) {
  return (
    <Text.Caption>
      {`${characterCount}${maxLength ? ` / ${maxLength}` : ""}`}
    </Text.Caption>
  );
}

export default SlateCharacterCount;
