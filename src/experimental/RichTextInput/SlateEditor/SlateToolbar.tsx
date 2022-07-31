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
  full,
  Icon,
  IconButton,
  IconButtonProps,
  ICON_BUTTON_SIZE_SMALL,
  Layout,
  SelectInput,
  Space,
  Text,
  Tooltip,
  TooltipElement,
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

const TooltipChildrenWrapper = styled.div.attrs({ fullWidth: true })`
  ${full};
`;

interface SlateToolbarItemProps {
  label?: string;
  isExpanded?: boolean;
  icon: IconButtonProps["icon"];
  onPress?: IconButtonProps["onPress"];
  onBlur?: IconButtonProps["onBlur"];
  onFocus?: IconButtonProps["onFocus"];
  active?: IconButtonProps["active"];
  focusable?: IconButtonProps["focusable"];
  isHovered?: IconButtonProps["isHovered"];
  disabled?: IconButtonProps["disabled"];
}

function SlateToolbarItem({
  icon,
  label,
  isExpanded,
  onPress,
  active,
  onBlur,
  onFocus,
  focusable,
  isHovered,
  disabled,
}: SlateToolbarItemProps) {
  const editor = useSlate();

  const iconButton = (
    <IconButton
      disabled={disabled}
      name={label}
      icon={icon}
      size="small"
      active={active}
      focusable={focusable}
      isHovered={isHovered}
      onPress={() => {
        onPress?.();
      }}
      onFocus={() => {
        onFocus?.();

        ReactEditor.focus(editor);
      }}
      onBlur={() => {
        onBlur?.();
      }}
    />
  );

  const button = (
    <Button
      disabled={disabled}
      name={label}
      fullWidth
      spacingSize={[0.25, 0]}
      active={active}
      focusable={focusable}
      isHovered={isHovered}
      onPress={() => {
        onPress?.();
      }}
      onFocus={() => {
        ReactEditor.focus(editor);
        onFocus?.();
      }}
      onBlur={() => {
        onBlur?.();
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

  return content;

  // return <Layout.Box fullWidth>{content}</Layout.Box>;
}

export interface SlateToolbarProps {
  disabled?: boolean;
  editor?: DefaultEditor;
  name?: string;
  // isFocused?: boolean;
}

function SlateToolbar({
  editor: editorProp,
  // isFocused,
  name,
  disabled,
}: SlateToolbarProps) {
  const defaultEditor = useSlate();
  const editor = editorProp || defaultEditor;

  const tooltipRef = React.useRef<TooltipElement>(null);

  const [isExpanded, setIsExpanded] = React.useState(false);
  const expanded = isExpanded; // && isFocused;

  React.useEffect(
    function handleDisabled() {
      if (disabled) {
        setIsExpanded(false);
        tooltipRef.current?.hide();
      }
    },
    [disabled]
  );

  // React.useEffect(
  //   function handleFocusChange() {
  //     if (!isFocused) {
  //       setIsExpanded(false);
  //     }
  //   },
  //   [isFocused]
  // );

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
            isExpanded={expanded}
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
            isExpanded={expanded}
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
        disabled={disabled}
        icon={expanded ? Icons.ArrowLeft : Icons.ArrowRight}
        isExpanded={expanded}
        onPress={() => {
          setIsExpanded(!expanded);
        }}
        label={expanded ? "Collapse" : "Expand"}
      />

      <Space />

      {markButtons}

      <Space />

      <Tooltip
        ref={tooltipRef}
        id={`SlateToolbar_Format_${name}`}
        placement="right"
        leftOffset={theme.spacing + theme.borderThickness}
        content={(tooltipProps) => (
          <SlateFormatMenu
            disabled={disabled}
            value={activeFormat}
            onChange={(type) => {
              setFormatElement({ type });
              tooltipProps.onBlur();
            }}
            onFocus={() => {
              log("format tooltip menu focus");
              ReactEditor.focus(editor);
            }}
          />
        )}
      >
        {(tooltipProps) => (
          <SlateToolbarItem
            disabled={disabled}
            isExpanded={expanded}
            isHovered={tooltipProps.focused}
            icon={Icons.Fonts}
            label={activeFormat ? startCase(activeFormat) : "Format"}
            onPress={tooltipProps.onPress}
          />
        )}
      </Tooltip>

      <Space />

      {listBlockButtons}
    </Layout.Column>
  );
}

export default SlateToolbar;
