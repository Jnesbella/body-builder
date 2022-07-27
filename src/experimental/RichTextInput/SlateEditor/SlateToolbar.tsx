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
import {
  useActiveFormat,
  useFocusEditor,
  useSetFormatElement,
} from "./slateHooks";
import SlateFormatMenu from "./SlateFormatMenu";

interface SlateToolbarItemProps {
  label?: string;
  isExpanded?: boolean;
  icon: IconButtonProps["icon"];
  onPress?: IconButtonProps["onPress"];
  onLayout?: IconButtonProps["onLayout"];
  onBlur?: IconButtonProps["onBlur"];
  onFocus?: IconButtonProps["onFocus"];
  onPressCapture?: IconButtonProps["onPressCapture"];
  active?: IconButtonProps["active"];
  preventDefault?: IconButtonProps["preventDefault"];
  focusOnPress?: IconButtonProps["focusOnPress"];
  focusOnPressCapture?: IconButtonProps["focusOnPressCapture"];
  focusMode?: IconButtonProps["focusMode"];
  onPointerDownCapture?: IconButtonProps["onPointerDownCapture"];
}

function SlateToolbarItem({
  icon,
  label,
  isExpanded,
  onPress,
  onLayout,
  onBlur,
  onFocus,
  onPressCapture,
  active,
  preventDefault,
  focusOnPress,
  focusOnPressCapture,
  focusMode,
  onPointerDownCapture,
}: SlateToolbarItemProps) {
  const iconButton = (
    <IconButton
      onPress={onPress}
      onPressCapture={onPressCapture}
      icon={icon}
      size="small"
      onBlur={onBlur}
      onFocus={onFocus}
      active={active}
      preventDefault={preventDefault}
      focusOnPressCapture={focusOnPressCapture}
      focusOnPress={focusOnPress}
      focusMode={focusMode}
      onPointerDownCapture={onPointerDownCapture}
    />
  );

  const button = (
    <Button
      onPress={onPress}
      onPressCapture={onPressCapture}
      fullWidth
      onLayout={onLayout}
      spacingSize={[0.25, 0]}
      onBlur={onBlur}
      onFocus={onFocus}
      active={active}
      preventDefault={preventDefault}
      focusOnPressCapture={focusOnPressCapture}
      focusOnPress={focusOnPress}
      focusMode={focusMode}
      onPointerDownCapture={onPointerDownCapture}
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

  const _focusEditor = useFocusEditor({ editor });

  const [isPendingFocus, setIsPendingFocus] = React.useState(false);

  const focusEditor = () => setIsPendingFocus(true);

  React.useLayoutEffect(
    function handlePendingFocus() {
      if (isPendingFocus) {
        const timeout = window.setTimeout(() => {
          _focusEditor({ force: true });
          setIsPendingFocus(false);
        });

        return () => {
          window.clearTimeout(timeout);
        };
      }
    },
    [isPendingFocus, _focusEditor]
  );

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
              focusEditor();
            }}
            icon={
              icon

              // <MarkButton
              //   disabled={disabled}
              //   mark={mark}
              //   icon={icon}
              //   size="small"
              // />
            }
            label={startCase(mark)}
          />
        </React.Fragment>
      ))}
    </React.Fragment>
  );

  const listBlockButtons = (
    <React.Fragment>
      {listBlocks.map(({ block: listType, icon }) => (
        <SlateToolbarItem
          key={listType}
          isExpanded={isExpanded}
          label={startCase(listType)}
          active={Editor.isListBlock(editor, listType)}
          onPress={() => {
            Editor.toggleListElement(editor, listType);
            focusEditor();
          }}
          icon={
            icon

            // <BlockButton
            //   key={listType}
            //   block={listType}
            //   disabled={disabled}
            //   icon={icon}
            //   onPress={() => {
            //     Editor.toggleListElement(editor, listType);
            //   }}
            //   isActive={Editor.isListBlock(editor, listType)}
            //   size="small"
            // />
          }
        />
      ))}
    </React.Fragment>
  );

  const activeFormat = useActiveFormat({ editor });

  const setFormatElement = useSetFormatElement({ editor });

  console.log("activeFormat: ", activeFormat);

  return (
    <Layout.Column alignItems="flex-start">
      <SlateToolbarItem
        icon={isExpanded ? Icons.ArrowLeft : Icons.ArrowRight}
        isExpanded={isExpanded}
        onPress={() => {
          setIsExpanded(!isExpanded);
          focusEditor();
        }}
        label={isExpanded ? "Collapse" : "Expand"}
      />

      {/* <IconButton
        icon={isExpanded ? Icons.ArrowLeft : Icons.ArrowRight}
        size="small"
        onPress={() => setIsExpanded(!isExpanded)}
      /> */}

      <Space />

      {markButtons}

      <Space />

      <Tooltip
        content={
          <SlateFormatMenu
            value={activeFormat}
            onChangeCapture={(type) => {
              log("onChangeCapture: ", type);
              setFormatElement({ type });
              focusEditor();
              // window.setTimeout(() => {
              //   focusEditor();
              // }, 1000);
            }}
          />
        }
        id={`${name}FormatTooltip`}
      >
        {({ onLayout, onBlur, onFocus }) => (
          <SlateToolbarItem
            isExpanded={isExpanded}
            icon={Icons.Fonts}
            label={activeFormat ? startCase(activeFormat) : "Format"}
            focusMode="uncontrolled"
            // onPress={() => {
            //   // log("onPressCapture: ", { focused });
            //   // if (focused) {
            //   // onPress();
            //   // focusEditor();
            //   // }
            // }}
            onFocus={() => {
              console.log("focus");
              onFocus();
            }}
            onLayout={onLayout}
            onBlur={() => {
              console.log("blur");
              onBlur();
            }}
          />
        )}
      </Tooltip>

      {/* <SlateToolbarItem
        isExpanded={isExpanded}
        icon={
          Icons.Fonts

          // <SlateFormatInput
          //   name="elementFormatType"
          //   value={activeFormat}
          //   onChange={(type) => setFormatElement({ type })}
          // />
        }
        label="Format"
      /> */}

      {/* <Divider width={theme.spacing * 4} /> */}

      <Space />

      {listBlockButtons}
    </Layout.Column>
  );

  // return <Container>{markButtons}</Container>;
}

export default SlateToolbar;
