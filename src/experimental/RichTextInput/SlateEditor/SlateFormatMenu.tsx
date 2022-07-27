import * as React from "react";
import styled from "styled-components";
import * as Icons from "react-bootstrap-icons";
import { ReactEditor, useSlate, useSlateStatic } from "slate-react";
import { Transforms, Editor as DefaultEditor } from "slate";
import { startCase, isEqual } from "lodash";

import { Divider, Layout, SelectInput, Space, Text } from "../../../components";
import { theme } from "../../../styles";
import { Normal, Heading, Subheading, Caption, Label } from "./SlateElement";
import { log } from "../../../utils";
import {
  CustomEditor,
  CustomElement,
  FormatElement,
  ListElement,
} from "../../../typings-slate";

import MarkButton, { MarkButtonProps } from "./MarkButton";
import BlockButton, { BlockButtonProps } from "./BlockButton";
import { FORMAT_TYPES } from "./slateConstants";
import { Editor, Element } from "./slate";
import Menu from "../../../components/Menu";

export interface SlateFormatMenuProps {
  disabled?: boolean;
  value?: FormatElement["type"];
  onChange?: (type: FormatElement["type"]) => void;
  onChangeCapture?: (type: FormatElement["type"]) => void;
}

function SlateFormatMenu({
  disabled,
  value,
  onChange,
  onChangeCapture,
}: SlateFormatMenuProps) {
  return (
    <Menu>
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
            disabled={disabled}
            selected={isSelected}
            onPress={() => onChange?.(type)}
            onPointerDownCapture={() => onChangeCapture?.(type)}
          >
            <Wrapper>{startCase(type)}</Wrapper>
          </Menu.Item>
        );
      })}
    </Menu>
  );
}

export default SlateFormatMenu;
