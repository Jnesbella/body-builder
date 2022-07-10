import * as React from "react";
import styled from "styled-components";
import * as Icons from "react-bootstrap-icons";
import { ReactEditor, useSlate, useSlateStatic } from "slate-react";
import { Transforms } from "slate";
import { startCase } from "lodash";

import { Divider, Layout, SelectInput, Space, Text } from "../../../components";
import { theme } from "../../../styles";
import { Normal, Heading, Subheading, Caption, Label } from "./SlateElement";
import { log } from "../../../utils";
import {
  CustomElement,
  FormatElement,
  ListElement,
} from "../../../typings-slate";

import MarkButton, { MarkButtonProps } from "./MarkButton";
import BlockButton, { BlockButtonProps } from "./BlockButton";
import { FORMAT_TYPES } from "./slateConstants";
import { Editor, Element } from "./slate";

export interface SlateToolbarProps {
  disabled?: boolean;
}

function SlateToolbar({ disabled }: SlateToolbarProps) {
  const editor = useSlate();

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

      log("activeFormatType: ", { element });

      const { type } = (element as FormatElement) || {};

      return type ? type : undefined;
    }, [editor, editor.selection]);

  return (
    <Layout.Row alignItems="center">
      {markButtons}

      {/* <Space /> */}
      {/* <Divider vertical height={theme.spacing * 3} />
      <Space /> */}

      <SelectInput
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

      <Space />

      <Divider vertical height={theme.spacing * 3} />

      <Space />

      {/* {blockButtons} */}
      {/* <Space /> */}

      {listBlockButtons}
    </Layout.Row>
  );

  // return <Container>{markButtons}</Container>;
}

export default SlateToolbar;
