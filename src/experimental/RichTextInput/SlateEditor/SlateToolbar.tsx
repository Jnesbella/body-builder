import * as React from "react";
import styled from "styled-components";
import * as Icons from "react-bootstrap-icons";
import { ReactEditor, useSlate, useSlateStatic } from "slate-react";
import { Transforms, Editor as DefaultEditor } from "slate";
import { startCase } from "lodash";

import {
  Button,
  Divider,
  FontSize,
  Icon,
  IconButton,
  IconButtonProps,
  ICON_BUTTON_SIZE_SMALL,
  Layout,
  SelectInput,
  Space,
  Text,
  Tooltip,
} from "../../../components";
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
import SlateFormatInput from "./SlateFormatInput";
import { useActiveFormat, useSetFormatElement } from "./slateHooks";
import SlateFormatMenu from "./SlateFormatMenu";

interface SlateToolbarItemProps {
  label?: string;
  isExpanded?: boolean;
  icon: IconButtonProps["icon"];
  onPress?: IconButtonProps["onPress"];
  onLayout?: IconButtonProps["onLayout"];
  onBlur?: IconButtonProps["onBlur"];
  onFocus?: IconButtonProps["onFocus"];
  active?: IconButtonProps["active"];
  focusMode?: IconButtonProps["focusMode"];
}

function SlateToolbarItem({
  icon,
  label,
  isExpanded,
  onPress,
  onLayout,
  active,
  focusMode,
}: SlateToolbarItemProps) {
  const editor = useSlate();

  const iconButton = (
    <IconButton
      icon={icon}
      size="small"
      active={active}
      focusMode={focusMode}
      onPress={() => {
        // ReactEditor.focus(editor);
        onPress?.();
        ReactEditor.focus(editor);
      }}
    />
  );

  const button = (
    <Button
      fullWidth
      onLayout={onLayout}
      spacingSize={[0.25, 0]}
      active={active}
      focusMode={focusMode}
      onPress={() => {
        onPress?.();
        ReactEditor.focus(editor);
      }}
    >
      {(buttonProps) => (
        <Button.Container {...buttonProps}>
          <Layout.Row alignItems="center">
            <Icon
              color={buttonProps.color}
              background={buttonProps.background}
              icon={icon}
              size={theme.spacing * 2}
            />

            <Space />

            <Text.Label
              fontSize={FontSize.ExtraSmall}
              color={buttonProps.color}
              background={buttonProps.background}
            >
              {label}
            </Text.Label>
          </Layout.Row>
        </Button.Container>
      )}
    </Button>
  );

  const content = !isExpanded || !label ? iconButton : button;

  return (
    <Layout.Row onLayout={onLayout} fullWidth>
      {content}
    </Layout.Row>
  );
}

export interface SlateToolbarProps {
  disabled?: boolean;
  editor?: DefaultEditor;
  name?: string;
}

function SlateToolbar({ editor: editorProp, name }: SlateToolbarProps) {
  const defaultEditor = useSlate();
  const editor = editorProp || defaultEditor;

  const [isExpanded, setIsExpanded] = React.useState(false);

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
      {marks.map(({ mark, icon }, index) => (
        <React.Fragment key={mark}>
          {index > 0 && <Divider background={theme.colors.transparent} />}

          <SlateToolbarItem
            isExpanded={isExpanded}
            active={Editor.hasMark(editor, mark)}
            onPress={() => {
              Editor.toggleMark(editor, mark);
            }}
            icon={icon}
            label={startCase(mark)}
          />
        </React.Fragment>
      ))}
    </React.Fragment>
  );

  const listBlockButtons = (
    <React.Fragment>
      {listBlocks.map(({ block: listType, icon }, index) => (
        <React.Fragment key={listType}>
          {index > 0 && <Divider background={theme.colors.transparent} />}

          <SlateToolbarItem
            isExpanded={isExpanded}
            label={startCase(listType)}
            active={Editor.isListBlock(editor, listType)}
            onPress={() => {
              Editor.toggleListElement(editor, listType);
            }}
            icon={icon}
          />
        </React.Fragment>
      ))}
    </React.Fragment>
  );

  const activeFormat = useActiveFormat({ editor });

  const setFormatElement = useSetFormatElement({ editor });

  return (
    <Layout.Column alignItems="flex-start">
      <SlateToolbarItem
        icon={isExpanded ? Icons.ArrowLeft : Icons.ArrowRight}
        isExpanded={isExpanded}
        onPress={() => {
          setIsExpanded(!isExpanded);
        }}
        label={isExpanded ? "Collapse" : "Expand"}
      />

      <Space />

      {markButtons}

      <Space />

      <Tooltip
        content={({ onBlur }) => (
          <SlateFormatMenu
            value={activeFormat}
            onChange={(type) => {
              setFormatElement({ type });
              ReactEditor.focus(editor);

              onBlur();
            }}
          />
        )}
        id={`${name}FormatTooltip`}
      >
        {({ onLayout, onPress, onBlur }) => (
          <SlateToolbarItem
            isExpanded={isExpanded}
            icon={Icons.Fonts}
            label={activeFormat ? startCase(activeFormat) : "Format"}
            focusMode="uncontrolled"
            onBlur={onBlur}
            onPress={onPress}
            onLayout={onLayout}
          />
        )}
      </Tooltip>

      <Space />

      {listBlockButtons}
    </Layout.Column>
  );
}

export default SlateToolbar;
