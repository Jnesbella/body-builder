import * as React from "react";
import { startCase, isEqual } from "lodash";

import { FormatElement } from "../../../typings-slate";
import { Text, Menu, MenuItemProps } from "../../../components";

import { TEXT_ALIGN_TYPES } from "./slateConstants";

export interface SlateFormatMenuProps {
  disabled?: boolean;
  value?: FormatElement["textAlign"];
  onChange?: (type: FormatElement["textAlign"]) => void;
  onChangeCapture?: (type: FormatElement["textAlign"]) => void;
  onFocus?: MenuItemProps["onFocus"];
  onBlur?: MenuItemProps["onBlur"];
}

function SlateFormatMenu({
  disabled,
  value,
  onChange,
  onChangeCapture,
  onFocus,
  onBlur,
}: SlateFormatMenuProps) {
  return (
    <Menu elevation={1}>
      {TEXT_ALIGN_TYPES.map((type) => {
        const isSelected = isEqual(type, value);

        return (
          <Menu.Item
            key={type}
            focusOn="none"
            disabled={disabled}
            selected={isSelected}
            onPress={() => onChange?.(type)}
            onPressCapture={() => onChangeCapture?.(type)}
            onFocus={onFocus}
            onBlur={onBlur}
          >
            <Text>{startCase(type)}</Text>
          </Menu.Item>
        );
      })}
    </Menu>
  );
}

export default SlateFormatMenu;
