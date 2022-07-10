import * as React from "react";
import ReactDOM from "react-dom";
import { get, isEqual } from "lodash";
import styled from "styled-components/native";

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
import { LayoutRectangle } from "react-native";

const OptionText = styled(Text).attrs<{ isSelected?: boolean }>(
  ({ isSelected }) => ({
    fontWeight: isSelected ? FontWeight.Bold : FontWeight.Normal,
  })
)`
  ${fontWeight};
`;

const SelectInputContainer = styled(Layout.Column)`
  position: relative;
`;

const SelectInputOptions = styled(Layout.Column).attrs({ fullWidth: true })<{
  top: number;
  left: number;
}>`
  ${rounded};
  ${full};
  ${shadow};
  ${zIndex("aboveAll")};

  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;

  background: ${theme.colors.background};
  max-width: ${theme.spacing * 30}px;
  max-height: ${theme.spacing * 40}px;
  position: absolute;
  elevation: 1;
`;

function Portal({ children }: { children: React.ReactNode }) {
  const [container] = React.useState(document.createElement("div"));

  React.useEffect(
    function removeContainerOnUnmount() {
      document.body.appendChild(container);

      return () => {
        document.body.removeChild(container);
      };
    },
    [container]
  );

  return ReactDOM.createPortal(children, container);
}

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
}

function SelectInput<Option>({
  options,
  renderOption,
  getKey,
  onChangeOption,
  value,
  isEqual: isEqualProp = isEqual,
  getInputValue,
  ...textInputProps
}: SelectInputProps<Option>) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [layout, setLayout] = React.useState<LayoutRectangle>();
  const left = get(layout, "left", 0);
  const top = get(layout, "top", 0) + get(layout, "height", 0);

  return (
    <SelectInputContainer
      onLayout={(event) => setLayout(event.nativeEvent.layout)}
    >
      <TextInput
        {...textInputProps}
        editable={false}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={
          (value && getInputValue?.(value)) ||
          (typeof value === "string" && value) ||
          ""
        }
      />

      {isFocused && (
        <Portal>
          <SelectInputOptions left={left} top={top}>
            {options?.map((option) => (
              <Button
                key={
                  getKey?.(option) ||
                  (typeof option === "string" ? option : undefined)
                }
                onPressCapture={() => onChangeOption?.(option)}
              >
                {renderOption?.({
                  option,
                  isSelected: isEqualProp?.(option, value),
                }) ||
                  (typeof option === "string" ? (
                    <OptionText isSelected={isEqualProp?.(option, value)}>
                      {option}
                    </OptionText>
                  ) : null)}
              </Button>
            ))}
          </SelectInputOptions>
        </Portal>
      )}
    </SelectInputContainer>
  );
}

SelectInput.OptionText = OptionText;

export default SelectInput;
