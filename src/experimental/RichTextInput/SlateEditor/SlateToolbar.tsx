import * as React from "react";
import styled from "styled-components";
import * as Icons from "react-bootstrap-icons";
import { ReactEditor, useSlate } from "slate-react";
import { Editor as DefaultEditor } from "slate";
import { HistoryEditor } from "slate-history";
import { startCase } from "lodash";

import {
  Button,
  Divider,
  FontSize,
  full,
  Icon,
  IconButton,
  IconButtonProps,
  Layout,
  Space,
  Text,
  Tooltip,
  TooltipElement,
} from "../../../components";
import { theme } from "../../../styles";
import { ListElement } from "../../../typings-slate";

import { MarkButtonProps } from "./MarkButton";
import { BlockButtonProps } from "./BlockButton";
import { Editor } from "./slate";
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
  tooltipDisabled?: boolean;
  id?: IconButtonProps["id"];
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
  tooltipDisabled,
  id,
}: SlateToolbarItemProps) {
  const editor = useSlate();

  const iconButton = (
    <Tooltip
      placement="right-center"
      content={<Tooltip.Text>{startCase(label)}</Tooltip.Text>}
      leftOffset={theme.spacing + 1}
      visiblity={tooltipDisabled ? "hidden" : "visible"}
    >
      {(tooltipProps) => (
        <IconButton
          id={id}
          disabled={disabled}
          icon={icon}
          size="small"
          active={active}
          focusable={focusable}
          isHovered={isHovered}
          focusOn="none"
          onPress={() => {
            onPress?.();
            ReactEditor.focus(editor);
          }}
          onFocus={() => {
            onFocus?.();
          }}
          onBlur={() => {
            onBlur?.();
          }}
          onHoverOver={tooltipProps.onHoverOver}
          onHoverOut={tooltipProps.onHoverOut}
        />
      )}
    </Tooltip>
  );

  const button = (
    <Button
      id={id}
      disabled={disabled}
      fullWidth
      spacingSize={[0.25, 0]}
      active={active}
      focusable={focusable}
      isHovered={isHovered}
      focusOn="none"
      onPress={() => {
        onPress?.();
        ReactEditor.focus(editor);
      }}
      onFocus={() => {
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
              fill={buttonProps.color}
              icon={icon}
              size={theme.spacing * 2}
            />

            <Space />

            <Text.Label
              fontSize={FontSize.ExtraSmall}
              color={buttonProps.color}
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
  tooltipsDisabled?: boolean;
  onFocusItem?: () => void;
}

function SlateToolbar({
  editor: editorProp,
  name,
  disabled,
  tooltipsDisabled,
  onFocusItem,
}: SlateToolbarProps) {
  const defaultEditor = useSlate();
  const editor = editorProp || defaultEditor;

  const tooltipRef = React.useRef<TooltipElement>(null);

  const [isExpanded, setIsExpanded] = React.useState(false);
  const expanded = isExpanded; // && isFocused;

  const setFormatElement = useSetFormatElement({ editor });

  React.useEffect(
    function handleDisabled() {
      if (disabled) {
        setIsExpanded(false);
        tooltipRef.current?.hide();
      }
    },
    [disabled]
  );

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
            tooltipDisabled={tooltipsDisabled}
            isExpanded={expanded}
            active={Editor.hasMark(editor, mark)}
            onPress={() => {
              Editor.toggleMark(editor, mark);
            }}
            onFocus={onFocusItem}
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
            tooltipDisabled={tooltipsDisabled}
            isExpanded={expanded}
            label={startCase(listType)}
            active={Editor.isListBlock(editor, listType)}
            onPress={() => {
              Editor.toggleListElement(editor, listType);
            }}
            icon={icon}
            onFocus={onFocusItem}
          />
        </React.Fragment>
      ))}
    </React.Fragment>
  );

  const activeFormat = useActiveFormat({ editor });

  const undo = () => HistoryEditor.undo(editor);

  const redo = () => HistoryEditor.redo(editor);

  return (
    <Layout.Column alignItems="flex-start">
      <SlateToolbarItem
        tooltipDisabled={tooltipsDisabled}
        disabled={disabled}
        icon={expanded ? Icons.ArrowLeft : Icons.ArrowRight}
        isExpanded={expanded}
        onPress={() => {
          setIsExpanded(!expanded);
        }}
        label={expanded ? "Collapse" : "Expand"}
        onFocus={onFocusItem}
      />

      <Space />

      <SlateToolbarItem
        disabled={disabled || !Editor.canUndo(editor)}
        tooltipDisabled={tooltipsDisabled}
        icon={Icons.ArrowCounterclockwise}
        isExpanded={expanded}
        onPress={undo}
        label="Undo"
        id="undo"
        onFocus={onFocusItem}
      />

      <SlateToolbarItem
        id="redo"
        disabled={disabled || !Editor.canRedo(editor)}
        tooltipDisabled={tooltipsDisabled}
        icon={Icons.ArrowClockwise}
        isExpanded={expanded}
        onPress={redo}
        label="Redo"
        onFocus={onFocusItem}
      />

      <Space />

      {markButtons}

      <Space />

      <Tooltip
        ref={tooltipRef}
        id={`SlateToolbar_Format_${name}`}
        placement="right"
        leftOffset={theme.spacing + 1}
        renderChildren={Tooltip.ContentFullWidth}
        content={(tooltipProps) => (
          <SlateFormatMenu
            disabled={disabled}
            value={activeFormat}
            onChange={(type) => {
              setFormatElement({ type });
              ReactEditor.focus(editor);
              tooltipProps.hide();
            }}
            onFocus={onFocusItem}
          />
        )}
      >
        {(tooltipProps) => (
          <SlateToolbarItem
            tooltipDisabled={tooltipsDisabled}
            disabled={disabled}
            isExpanded={expanded}
            isHovered={tooltipProps.focused}
            icon={Icons.Fonts}
            label={activeFormat ? startCase(activeFormat) : "Format"}
            onPress={tooltipProps.onPress}
            onFocus={onFocusItem}
          />
        )}
      </Tooltip>

      <Space />

      {listBlockButtons}
    </Layout.Column>
  );
}

export default SlateToolbar;
