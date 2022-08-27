import * as React from "react";
import styled from "styled-components";
import * as Icons from "react-bootstrap-icons";
import { ReactEditor, useSlate, useSlateStatic } from "slate-react";
import { Transforms, Editor as DefaultEditor } from "slate";
import { startCase } from "lodash";

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
import { Editor, Element } from "./customSlate";

export interface SlateToolbarProps {
  disabled?: boolean;
  editor?: DefaultEditor;
}

function SlateToolbar({ disabled, editor: editorProp }: SlateToolbarProps) {
  const defaultEditor = useSlate();
  const editor = editorProp || defaultEditor;

  const activeFormatType: FormatElement["type"] | undefined =
    React.useMemo(() => {
      const [match] =
        Editor.nodes(editor, {
          match: (node) =>
            !Editor.isEditor(node) &&
            Element.isElement(node) &&
            Element.isFormatElement(node),
          mode: "lowest",
        }) || [];
      const [element] = match || [];

      const { type } = (element as FormatElement) || {};

      return type ? type : undefined;
    }, [editor, editor.selection]);

  return (
    <SelectInput
      disabled={disabled}
      options={FORMAT_TYPES}
      value={activeFormatType}
      onChangeOption={(option) => {
        // const { selection } = editor;

        Editor.setFormatElement(editor, { type: option });

        // ReactEditor.focus(editor);

        // if (selection) {
        //   Transforms.select(editor, selection);
        // }
      }}
      getInputValue={(option) => startCase(option)}
      renderOption={({ option }) => {
        let Wrapper: (props: any) => JSX.Element = Normal;

        switch (option) {
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

        return <Wrapper>{startCase(option)}</Wrapper>;
      }}
    />
  );
}

export default SlateToolbar;
