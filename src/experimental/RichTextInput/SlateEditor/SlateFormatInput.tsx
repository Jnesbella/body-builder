import * as React from "react";
import * as Icons from "react-bootstrap-icons";

import { IconButton, Layout, Tooltip } from "../../../components";
import { theme } from "../../../styles";

import { FORMAT_TYPES } from "./slateConstants";
import { Editor, Element } from "./slate";

import {
  CustomEditor,
  CustomElement,
  FormatElement,
  ListElement,
} from "../../../typings-slate";

import SlateFormatMenu, { SlateFormatMenuProps } from "./SlateFormatMenu";
import { useSlate } from "slate-react";
import { log } from "../../../utils";

export interface SlateFormatInputProps extends SlateFormatMenuProps {
  hovered?: boolean;
  name?: string;
}

function SlateFormatInput({
  hovered,
  name,
  ...slateFormatMenuProps
}: SlateFormatInputProps) {
  return (
    <Tooltip
      id={name}
      content={<SlateFormatMenu {...slateFormatMenuProps} />}
      placement="right"
    >
      {({ onBlur, onFocus, onLayout, onPress }) => (
        <Layout.Box onLayout={onLayout}>
          <IconButton
            size="small"
            icon={Icons.Type}
            onBlur={onBlur}
            onFocus={onFocus}
            onPress={onPress}
          />
        </Layout.Box>
      )}
    </Tooltip>
  );
}

export default SlateFormatInput;