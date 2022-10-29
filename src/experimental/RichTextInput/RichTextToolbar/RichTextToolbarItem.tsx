import * as React from "react";
import { ReactEditor } from "slate-react";
import { startCase } from "lodash";

import {
  Button,
  Icon,
  IconButton,
  IconButtonProps,
  Layout,
  Space,
  Text,
  Tooltip,
  TooltipProps,
} from "../../../components";
import { theme } from "../../../styles";
import { CustomEditor } from "../../../slateTypings";

export interface RichTextToolbarItemProps {
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
  editor?: CustomEditor;
  topOffset?: TooltipProps["topOffset"];
  onHoverOver?: IconButtonProps["onHoverOver"];
  onHoverOut?: IconButtonProps["onHoverOut"];
  onPressCapture?: IconButtonProps["onPressCapture"];
}

function RichTextToolbarItem({
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
  editor,
  topOffset,
  onHoverOver,
  onHoverOut,
  onPressCapture,
}: RichTextToolbarItemProps) {
  const iconButton = (
    <Tooltip
      topOffset={topOffset}
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
          // size="small"
          active={active}
          focusable={focusable}
          isHovered={isHovered}
          focusOn="none"
          onPress={() => {
            onPress?.();

            if (editor) {
              ReactEditor.focus(editor);
            }
          }}
          onFocus={onFocus}
          onBlur={onBlur}
          onHoverOver={tooltipProps.onHoverOver}
          onHoverOut={tooltipProps.onHoverOut}
          onPressCapture={onPressCapture}
        />
      )}
    </Tooltip>
  );

  const button = (
    <Button
      id={id}
      disabled={disabled}
      fullWidth
      spacingSize={[0.75, 0]}
      active={active}
      focusable={focusable}
      isHovered={isHovered}
      focusOn="none"
      onPress={() => {
        onPress?.();

        if (editor) {
          ReactEditor.focus(editor);
        }
      }}
      onFocus={onFocus}
      onBlur={onBlur}
      onHoverOut={onHoverOut}
      onHoverOver={onHoverOver}
      onPressCapture={onPressCapture}
    >
      {(buttonProps) => (
        <Button.Container
          {...buttonProps}
          style={{ height: theme.spacing * 4.5 }}
        >
          <Layout.Row alignItems="center">
            <Icon fill={buttonProps.color} icon={icon} />

            <Space />

            <Text.Label color={buttonProps.color}>{label}</Text.Label>
          </Layout.Row>
        </Button.Container>
      )}
    </Button>
  );

  const content = !isExpanded || !label ? iconButton : button;

  return content;
}

export default RichTextToolbarItem;
