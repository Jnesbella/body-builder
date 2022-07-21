import * as React from "react";
import * as Icons from "react-bootstrap-icons";

import { IconButton, Layout, Tooltip } from "../../../components";
import { theme } from "../../../styles";

import SlateFormatMenu from "./SlateFormatMenu";

export interface SlateFormatInputProps {
  hovered?: boolean;
}

function SlateFormatInput({ hovered }: SlateFormatInputProps) {
  return (
    <Tooltip content={<SlateFormatMenu />}>
      {({ onBlur, onFocus, onLayout, focused }) => (
        <Layout.Box onLayout={onLayout} opacity={hovered || focused ? 1 : 0}>
          <IconButton
            size="small"
            icon={Icons.Type}
            onBlur={onBlur}
            onFocus={onFocus}
            onPress={onFocus}
          />
        </Layout.Box>
      )}
    </Tooltip>
  );
}

export default SlateFormatInput;
