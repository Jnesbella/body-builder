import * as React from "react";
import {
  IconButton,
  Menu,
  TextInput,
  Tooltip,
  Text,
  Layout,
  Divider,
  Icon,
  ICON_SIZE_SMALL,
  theme,
  Space,
  Surface,
  rounded,
  Effect,
} from "@jnesbella/body-builder";
import * as Icons from "react-bootstrap-icons";
import { useCreateTag, useListTags } from "../hooks";
import { Tag } from "../types";
import styled from "styled-components/native";
import { compact } from "lodash";
import { Chip } from "./common";

export interface NoteTagsInputProps {
  value?: Tag["id"][];
  onChange?: (value: Tag["id"][]) => void;
  disabled?: boolean;
}

function NoteTagsInput({
  value = [],
  onChange,
  disabled: isDisabled,
}: NoteTagsInputProps) {
  const [label, setLabel] = React.useState("");

  const { data: tags } = useListTags();

  const { create: createTag } = useCreateTag({
    onSuccess: (tag) => {
      onChange?.([...value, tag.id]);
    },
  });

  const isCreateEnabled = label.length >= 2;

  const selectedTags = tags.filter((tag) => value.includes(tag.id));

  const [item1, item2, ...rest] = selectedTags;

  const doCreateTag = () => {
    if (isCreateEnabled) {
      createTag({ label });
      setLabel("");
    }
  };

  const tooltipMenu = (
    <Menu elevation={1}>
      <Layout.Column spacingSize={[0, 1]}>
        <Layout.Box spacingSize={[1, 0]}>
          <Text.Caption>Add tags</Text.Caption>
        </Layout.Box>

        <Layout.Box spacingSize={[0, 1]}>
          <TextInput
            value={label}
            onChangeText={setLabel}
            placeholder="Filter tags"
          />
        </Layout.Box>

        {tags?.map((tag) => (
          <Menu.Item
            key={tag.id}
            fullWidth
            focusOn="none"
            focusable={false}
            onPress={() => {
              const isChecked = value.includes(tag.id);
              onChange?.(
                isChecked
                  ? value?.filter((id) => id !== tag.id)
                  : [...value, tag.id]
              );
            }}
          >
            <Layout.Row alignItems="center">
              <Icon icon={Icons.Hash} />

              <Text>{tag.label}</Text>

              <Layout.Box greedy />

              <Space />

              <Layout.Box
                style={{
                  opacity: value.includes(tag.id) ? 1 : 0.3,
                }}
              >
                <Icon
                  icon={Icons.Check}
                  color={
                    value.includes(tag.id)
                      ? theme.colors.primary
                      : theme.colors.textPlaceholder
                  }
                />
              </Layout.Box>
            </Layout.Row>
          </Menu.Item>
        ))}

        {isCreateEnabled && (
          <React.Fragment>
            <Layout.Box spacingSize={[0, 1]}>
              <Divider />
            </Layout.Box>

            <Menu.Item fullWidth onPress={doCreateTag}>
              <Layout.Row alignItems="center">
                <Icon
                  icon={Icons.Plus}
                  size={ICON_SIZE_SMALL}
                  color={theme.colors.textPlaceholder}
                />

                <Space spacingSize={0.5} />

                <Text.Caption>Create new tag "{label}"</Text.Caption>
              </Layout.Row>
            </Menu.Item>
          </React.Fragment>
        )}
      </Layout.Column>
    </Menu>
  );

  return (
    <Layout.Row alignItems="center">
      <Effect.FadeIn
        fadeIn={!isDisabled}
        fadeOut={isDisabled}
        duration={isDisabled ? 0 : 200}
      >
        <Tooltip
          content={tooltipMenu}
          placement="top"
          topOffset={-theme.spacing}
        >
          {(tooltipProps) => (
            <IconButton
              selected={tooltipProps.focused}
              icon={Icons.Hash}
              onPress={tooltipProps.toggleVisibility}
              focusable={false}
              focusOn="none"
              size="small"
              disabled={isDisabled}
              // onHoverOut={tooltipProps.onHoverOut}
              // onHoverOver={tooltipProps.onHoverOver}
            />
          )}
        </Tooltip>
      </Effect.FadeIn>

      {compact([item1, item2]).map((tag) => (
        <React.Fragment key={tag.id}>
          <Space />

          <Chip label={tag.label} size="small" />
        </React.Fragment>
      ))}

      {rest.length > 0 && (
        <React.Fragment>
          <Space />

          <Chip label={`+${rest.length}`} size="small" />
        </React.Fragment>
      )}
    </Layout.Row>
  );
}

export default NoteTagsInput;
