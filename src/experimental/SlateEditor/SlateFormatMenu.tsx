import * as React from "react";
import { startCase, isEqual } from "lodash";

import { FormatElement } from "../../slateTypings";
import Menu, { MenuItemProps } from "../../components/Menu";

import { FORMAT_TYPES } from "./slateConstants";
import {
  Normal,
  Heading,
  Subheading,
  Caption,
  Label,
} from "./SlateElement/FormatElementText";

export interface SlateFormatMenuProps {
  disabled?: boolean;
  value?: FormatElement["type"];
  onChange?: (type: FormatElement["type"]) => void;
  onChangeCapture?: (type: FormatElement["type"]) => void;
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
      {FORMAT_TYPES.map((type) => {
        const isSelected = isEqual(type, value);

        let Wrapper: (props: any) => JSX.Element = Normal;

        switch (type) {
          case "heading":
            Wrapper = Heading;
            break;

          case "subheading":
            Wrapper = Subheading;
            break;

          case "caption":
            Wrapper = Caption;
            break;

          case "label":
            Wrapper = Label;
            break;
        }

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
            fullWidth
          >
            <Wrapper>{startCase(type)}</Wrapper>
          </Menu.Item>
        );
      })}
    </Menu>
  );
}

export default SlateFormatMenu;
