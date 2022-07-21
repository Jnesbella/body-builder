import * as React from "react";
import ReactDOM from "react-dom";
import { get, isEqual } from "lodash";
import styled from "styled-components/native";
import { LayoutRectangle } from "react-native";

import { theme } from "../../styles";

import Button from "../Button";
import Layout from "../Layout";
import Text from "../Text";
import TextInput, { TextInputProps } from "../TextInput";
import { log } from "../../utils";
import {
  FontWeight,
  fontWeight,
  full,
  rounded,
  shadow,
  zIndex,
} from "../styled-components";
import Tooltip from "../Tooltip";
import Menu from "../Menu";

const OptionText = styled(Text).attrs<{ isSelected?: boolean }>(
  ({ isSelected }) => ({
    fontWeight: isSelected ? FontWeight.Bold : FontWeight.Normal,
  })
)`
  ${fontWeight};
`;

// const SelectInputOptions = styled(Layout.Column).attrs({ fullWidth: true })<{
//   // top: number;
//   // left: number;
// }>`
//   ${rounded};
//   ${full};
//   ${shadow};

//   background: ${theme.colors.background};
//   max-width: ${theme.spacing * 30}px;
//   max-height: ${theme.spacing * 40}px;
//   elevation: 1;
// `;

export interface SelectInputProps<Option>
  extends Omit<TextInputProps, "value"> {
  options?: Option[];
  renderOption?: (props: {
    option: Option;
    isSelected: boolean;
  }) => JSX.Element;
  onChangeOption?: (option: Option) => void;
  getKey?: (option: Option) => string;
  value?: Option;
  isEqual?: typeof isEqual;
  getInputValue?: (option: Option) => string;
  disabled?: boolean;
}

function SelectInput<Option>({
  options,
  renderOption,
  getKey,
  onChangeOption,
  value,
  isEqual: isEqualProp = isEqual,
  getInputValue,
  disabled,
  ...textInputProps
}: SelectInputProps<Option>) {
  // const [isFocused, setIsFocused] = React.useState(false);
  // const [layout, setLayout] = React.useState<LayoutRectangle>();
  // const left = get(layout, "left", 0);
  // const top = get(layout, "top", 0) + get(layout, "height", 0);

  return (
    <Tooltip
      content={
        !disabled && (
          <Menu>
            {options?.map((option) => {
              const isSelected = isEqualProp?.(option, value);

              return (
                <Menu.Item
                  key={
                    getKey?.(option) ||
                    (typeof option === "string" ? option : undefined)
                  }
                  onPressCapture={() => onChangeOption?.(option)}
                  selected={isSelected}
                >
                  {renderOption?.({
                    option,
                    isSelected,
                  }) ||
                    (typeof option === "string" ? (
                      <Menu.Text isSelected={isSelected}>{option}</Menu.Text>
                    ) : null)}
                </Menu.Item>
              );
            })}
          </Menu>
        )
      }
    >
      {({ onLayout, onFocus, onBlur }) => (
        <Layout.Box onLayout={onLayout}>
          <TextInput
            {...textInputProps}
            editable={false}
            onFocus={onFocus}
            onBlur={onBlur}
            value={
              (value && getInputValue?.(value)) ||
              (typeof value === "string" && value) ||
              ""
            }
          />
        </Layout.Box>
      )}
    </Tooltip>
  );
}

// SelectInput.OptionText = OptionText;

export default SelectInput;
