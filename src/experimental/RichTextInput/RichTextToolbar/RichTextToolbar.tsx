import * as React from "react";
import * as Icons from "react-bootstrap-icons";
import { ReactEditor } from "slate-react";
import { Editor as DefaultEditor } from "slate";
import { HistoryEditor } from "slate-history";
import { startCase } from "lodash";

import {
  Divider,
  Layout,
  Space,
  Tooltip,
  TooltipElement,
  TooltipProps,
} from "../../../components";
import { theme } from "../../../styles";
import { ListElement } from "../../../typings-slate";

import { MarkButtonProps } from "../SlateEditor/MarkButton";
import { BlockButtonProps } from "../SlateEditor/BlockButton";
import { Editor } from "../SlateEditor/customSlate";
import {
  useActiveFormat,
  useSetFormatElement,
} from "../SlateEditor/slateHooks";
import SlateFormatMenu from "../SlateEditor/SlateFormatMenu";

import ToolbarItem from "./RichTextToolbarItem";

export interface RichTextToolbarProps {
  disabled?: boolean;
  editor?: DefaultEditor;
  name?: string;
  tooltipsDisabled?: boolean;
  onFocusItem?: () => void;
  topOffset?: TooltipProps["topOffset"];
}

function RichTextToolbar({
  editor,
  name,
  disabled,
  tooltipsDisabled,
  onFocusItem,
  topOffset,
}: RichTextToolbarProps) {
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

          <ToolbarItem
            tooltipDisabled={tooltipsDisabled}
            isExpanded={expanded}
            active={editor && Editor.hasMark(editor, mark)}
            onPress={() => {
              if (editor) {
                Editor.toggleMark(editor, mark);
              }
            }}
            onFocus={onFocusItem}
            icon={icon}
            label={startCase(mark)}
            editor={editor}
            topOffset={topOffset}
            disabled={!editor || disabled}
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

          <ToolbarItem
            tooltipDisabled={tooltipsDisabled}
            isExpanded={expanded}
            label={startCase(listType)}
            active={editor && Editor.isListBlock(editor, listType)}
            onPress={() => {
              if (editor) {
                Editor.toggleListElement(editor, listType);
              }
            }}
            icon={icon}
            onFocus={onFocusItem}
            editor={editor}
            topOffset={topOffset}
            disabled={!editor || disabled}
          />
        </React.Fragment>
      ))}
    </React.Fragment>
  );

  const activeFormat = useActiveFormat({ editor });

  const undo = () => {
    if (editor) {
      HistoryEditor.undo(editor);
    }
  };

  const redo = () => {
    if (editor) {
      HistoryEditor.redo(editor);
    }
  };

  return (
    <Layout.Column alignItems="flex-start">
      <ToolbarItem
        tooltipDisabled={tooltipsDisabled}
        disabled={disabled}
        icon={expanded ? Icons.ArrowLeft : Icons.ArrowRight}
        isExpanded={expanded}
        onPress={() => {
          setIsExpanded(!expanded);
        }}
        label={expanded ? "Collapse" : "Expand"}
        onFocus={onFocusItem}
        editor={editor}
        topOffset={topOffset}
      />

      <Space />

      <ToolbarItem
        disabled={disabled || !editor || !Editor.canUndo(editor)}
        tooltipDisabled={tooltipsDisabled}
        icon={Icons.ArrowCounterclockwise}
        isExpanded={expanded}
        onPress={undo}
        label="Undo"
        id="undo"
        onFocus={onFocusItem}
        editor={editor}
        topOffset={topOffset}
      />

      <ToolbarItem
        id="redo"
        disabled={disabled || !editor || !Editor.canRedo(editor)}
        tooltipDisabled={tooltipsDisabled}
        icon={Icons.ArrowClockwise}
        isExpanded={expanded}
        onPress={redo}
        label="Redo"
        onFocus={onFocusItem}
        editor={editor}
        topOffset={topOffset}
      />

      <Space />

      {markButtons}

      <Space />

      <Tooltip
        topOffset={topOffset}
        ref={tooltipRef}
        id={`RichTextToolbar_Format_${name}`}
        placement="right"
        leftOffset={theme.spacing + 1}
        renderChildren={Tooltip.ContentFullWidth}
        content={(tooltipProps) => (
          <SlateFormatMenu
            disabled={disabled}
            value={activeFormat}
            onChange={(type) => {
              setFormatElement({ type });

              if (editor) {
                ReactEditor.focus(editor);
              }

              tooltipProps.hide();
            }}
            onFocus={onFocusItem}
          />
        )}
      >
        {(tooltipProps) => (
          <ToolbarItem
            tooltipDisabled={tooltipsDisabled}
            disabled={disabled || !editor}
            isExpanded={expanded}
            isHovered={tooltipProps.focused}
            icon={Icons.Fonts}
            label={activeFormat ? startCase(activeFormat) : "Format"}
            onPress={tooltipProps.onPress}
            onFocus={onFocusItem}
            editor={editor}
            topOffset={topOffset}
          />
        )}
      </Tooltip>

      <Space />

      {listBlockButtons}
    </Layout.Column>
  );
}

export default RichTextToolbar;
