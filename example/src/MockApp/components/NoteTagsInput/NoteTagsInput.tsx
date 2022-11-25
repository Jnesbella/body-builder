import * as React from "react";
import {
  IconButton,
  Tooltip,
  Layout,
  theme,
  Space,
  Effect,
  TooltipProps,
} from "@jnesbella/body-builder";
import * as Icons from "react-bootstrap-icons";
import { compact } from "lodash";

import { useCreateTag, useListTags } from "../../hooks";
import { Tag } from "../../types";

import { Chip } from "../common";

import NoteTagsInputMenu from "./NoteTagsInputMenu";

export interface NoteTagsInputProps {
  value?: Tag["id"][];
  onChange?: (value: Tag["id"][]) => void;
  disabled?: boolean;
  tooltipProps?: Partial<TooltipProps>;
}

function NoteTagsInput({
  value = [],
  onChange,
  disabled: isDisabled,
  tooltipProps,
}: NoteTagsInputProps) {
  const { data: tags } = useListTags();

  const appendTagToValue = (tag: Tag) => [...value, tag.id];

  const filterTagFromValue = (tag: Tag) => value.filter((id) => id !== tag.id);

  const { create: createTag } = useCreateTag({
    onSuccess: (tag) => {
      onChange?.([...value, tag.id]);
    },
  });

  const selectedTags = tags.filter((tag) => value.includes(tag.id));

  const [item1, item2, ...rest] = selectedTags;

  const doCreateTag = (label: string) => {
    createTag({ label });
  };

  return (
    <Layout.Row alignItems="center">
      <Effect.FadeIn
        fadeIn={!isDisabled}
        fadeOut={isDisabled}
        duration={isDisabled ? 0 : 200}
      >
        <Tooltip
          placement="top"
          {...tooltipProps}
          content={
            <NoteTagsInputMenu
              selectedTagIds={value}
              tags={tags}
              selectedTags={selectedTags}
              onCreateTag={doCreateTag}
              onPressTag={(tag) =>
                onChange?.(
                  value.includes(tag.id)
                    ? filterTagFromValue(tag)
                    : appendTagToValue(tag)
                )
              }
            />
          }
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
