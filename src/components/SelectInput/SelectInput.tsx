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

const OptionText = styled(Text).attrs<{ isSelected?: boolean }>(
  ({ isSelected }) => ({
    fontWeight: isSelected ? FontWeight.Bold : FontWeight.Normal,
  })
)`
  ${fontWeight};
`;

const SelectInputContainer = styled(Layout.Column)<{
  layout?: LayoutRectangle;
}>`
  position: relative;
`;

const SelectInputOptions = styled(Layout.Column).attrs({ fullWidth: true })<{
  // top: number;
  // left: number;
}>`
  ${rounded};
  ${full};
  ${shadow};

  background: ${theme.colors.background};
  max-width: ${theme.spacing * 30}px;
  max-height: ${theme.spacing * 40}px;
  elevation: 1;
`;

// const PortalChildrenWrapper = styled(Layout.Box)``;

// function Portal({ children }: { children: React.ReactNode }) {
//   const [container] = React.useState(document.createElement("div"));

//   React.useEffect(
//     function removeContainerOnUnmount() {
//       const applyContainerStyles = () => {
//         container.style.position = "fixed";
//         container.style.top = "0";
//         container.style.left = "0";
//         container.style.width = "100%";
//         container.style.height = "100%";
//       };

//       applyContainerStyles();

//       document.body.appendChild(container);

//       return () => {
//         document.body.removeChild(container);
//       };
//     },
//     [container]
//   );

//   return ReactDOM.createPortal(
//     <PortalChildrenWrapper>{children}</PortalChildrenWrapper>,
//     container
//   );
// }

// const TooltipContainer = styled(Layout.Box).attrs({
//   fullWidth: true,
// })`
//   ${full};
//   position: asbolute;
//   ${zIndex("aboveAll")};
//   height: 0;
// `;

// export interface TooltipProps {
//   children: React.ReactNode;
// }

// export function Tooltip({ children }: TooltipProps) {
//   return <TooltipContainer>{children}</TooltipContainer>;
// }

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
  const [isFocused, setIsFocused] = React.useState(false);
  const [layout, setLayout] = React.useState<LayoutRectangle>();
  // const left = get(layout, "left", 0);
  // const top = get(layout, "top", 0) + get(layout, "height", 0);

  return (
    <Layout.Column>
      {/* <SelectInputContainer
      onLayout={(event) => {
        log("onLayout", { event });
        setLayout(event.nativeEvent.layout);
      }}
   > */}
      <TextInput
        {...textInputProps}
        editable={false}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onLayout={(event) => {
          log("onLayout", { event });
          setLayout(event.nativeEvent.layout);
        }}
        value={
          (value && getInputValue?.(value)) ||
          (typeof value === "string" && value) ||
          ""
        }
      />

      <Tooltip layout={layout}>
        {!disabled && isFocused && (
          <SelectInputOptions>
            {options?.map((option) => {
              const isSelected = isEqualProp?.(option, value);

              return (
                <Button
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
                      <OptionText isSelected={isSelected}>{option}</OptionText>
                    ) : null)}
                </Button>
              );
            })}
          </SelectInputOptions>
        )}
      </Tooltip>
      {/* </SelectInputContainer> */}
    </Layout.Column>
  );
}

SelectInput.OptionText = OptionText;

export default SelectInput;
