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
import { Editor, Element } from "./slate";
import SlateFormatSelectInput from "./SlateFormatSelectInput";

export interface SlateToolbarProps {
  disabled?: boolean;
  editor?: DefaultEditor;
}

function SlateToolbar({ disabled, editor: editorProp }: SlateToolbarProps) {
  const defaultEditor = useSlate();
  const editor = editorProp || defaultEditor;

  const marks: {
    mark: MarkButtonProps["mark"];
    icon: MarkButtonProps["icon"];
  }[] = [
    { mark: "bold", icon: Icons.TypeBold },
    { mark: "italic", icon: Icons.TypeItalic },
    { mark: "underline", icon: Icons.TypeUnderline },
    { mark: "strikethrough", icon: Icons.TypeStrikethrough },
    { mark: "code", icon: Icons.Code },
  ];

  const blocks: {
    block: BlockButtonProps["block"];
    icon: BlockButtonProps["icon"];
  }[] = [
    { block: "block-quote", icon: Icons.BlockquoteLeft },
    { block: "code", icon: Icons.CodeSlash },

    { block: "bullet-list", icon: Icons.ListUl },
    { block: "number-list", icon: Icons.ListOl },
    { block: "task-list", icon: Icons.ListCheck },

    // { block: "link", icon: Icons.Link },
    // { block: "image", icon: Icons.Image },
  ];

  const listBlocks: {
    block: ListElement["type"];
    icon: BlockButtonProps["icon"];
  }[] = [
    { block: "bullet-list", icon: Icons.ListUl },
    { block: "number-list", icon: Icons.ListOl },
    { block: "task-list", icon: Icons.ListCheck },
  ];

  const markButtons = (
    <React.Fragment>
      {marks.map(({ mark, icon }) => (
        <Layout.Box key={mark} spacingSize={[0.25, 0]}>
          <MarkButton disabled={disabled} mark={mark} icon={icon} />
        </Layout.Box>
      ))}
    </React.Fragment>
  );

  const blockButtons = (
    <React.Fragment>
      {blocks.map(({ block, icon }) => (
        <BlockButton
          key={block}
          block={block}
          disabled={disabled}
          icon={icon}
        />
      ))}
    </React.Fragment>
  );

  const listBlockButtons = (
    <React.Fragment>
      {listBlocks.map(({ block: listType, icon }) => (
        <BlockButton
          key={listType}
          block={listType}
          disabled={disabled}
          icon={icon}
          onPress={() => {
            Editor.toggleListElement(editor, listType);
          }}
          isActive={Editor.isListBlock(editor, listType)}
        />
      ))}
    </React.Fragment>
  );

  return (
    <Layout.Row alignItems="center">
      {markButtons}

      <SlateFormatSelectInput />

      <Space />

      <Divider vertical height={theme.spacing * 3} />

      <Space />

      {listBlockButtons}
    </Layout.Row>
  );

  // return <Container>{markButtons}</Container>;
}

export default SlateToolbar;
