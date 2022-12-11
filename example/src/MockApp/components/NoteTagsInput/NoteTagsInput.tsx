import * as React from "react";
import {
  IconButton,
  Tooltip,
  Layout,
  theme,
  Effect,
  TooltipProps,
  TooltipElement,
  log,
} from "@jnesbella/body-builder";
import * as Icons from "react-bootstrap-icons";
import { compact } from "lodash";

import {
  useCreateTag,
  useListTags,
  useSearchTags,
  useSortedTags,
} from "../../hooks";
import { Tag } from "../../types";

import NoteTagsInputMenu from "./NoteTagsInputMenu";
import NoteTagsInputChips from "./NoteTagsInputChips";

export interface NoteTagsInputProps {
  value?: Tag["id"][];
  onChange?: (value: Tag["id"][]) => void;
  disabled?: boolean;
  tooltipProps?: Partial<TooltipProps>;
  minSearchLength?: number;
}

function NoteTagsInput({
  value = [],
  onChange,
  disabled: isDisabled,
  tooltipProps,
  minSearchLength = 2,
}: NoteTagsInputProps) {
  const { data: tags } = useListTags();

  const appendTagToValue = (tag: Tag) => [...value, tag.id];

  const filterTagFromValue = (tag: Tag) => value.filter((id) => id !== tag.id);

  const { create: createTag } = useCreateTag({
    onSuccess: (tag) => {
      onChange?.([...value, tag.id]);
    },
  });

  const selectedTags = compact(
    value.map((id) => tags.find((tag) => tag.id === id))
  );

  const doCreateTag = (label: string) => {
    createTag({ label });
  };

  const [search, setSearch] = React.useState("");

  const { data: initialSortedTags } = useSortedTags({ selectedTagIds: value });

  const [defaultSortedTags] = React.useState<Tag[]>(initialSortedTags);

  const isSearchEnabled = search.length >= minSearchLength;

  const isCreateEnabled = isSearchEnabled;

  const { data: searchedTags } = useSearchTags({ search });

  const sortedTags = isSearchEnabled ? searchedTags : defaultSortedTags;

  const tooltipRef = React.useRef<TooltipElement>(null);

  return (
    <Layout.Row alignItems="center">
      <Effect.FadeIn
        fadeIn={!isDisabled}
        fadeOut={isDisabled}
        duration={isDisabled ? 0 : 200}
        onFadeOutStart={() => {
          tooltipRef.current?.hide();
          // log("onFadeOutStart");
        }}
        onFadeOutComplete={() => {
          // todo: hide tooltip
          // tooltipRef.current?.hide();
        }}
      >
        <Tooltip
          ref={tooltipRef}
          placement="top"
          {...tooltipProps}
          content={(tooltipElement) => (
            <Effect.FadeIn
              fadeIn={tooltipElement.visible}
              fadeOut={!tooltipElement.visible}
              fadeInOnMount={false}
            >
              <NoteTagsInputMenu
                search={search}
                onSearchChange={setSearch}
                selectedTagIds={value}
                tags={sortedTags}
                createTagEnabled={isCreateEnabled}
                onCreateTag={doCreateTag}
                onPressTag={(tag) =>
                  onChange?.(
                    value.includes(tag.id)
                      ? filterTagFromValue(tag)
                      : appendTagToValue(tag)
                  )
                }
              />
            </Effect.FadeIn>
          )}
          // topOffset={-theme.spacing}
        >
          {(tooltipElement) => (
            <IconButton
              selected={tooltipElement.visible}
              icon={Icons.Hash}
              onPress={tooltipElement.toggleVisibility}
              focusable={false}
              focusOn="none"
              size="small"
              disabled={isDisabled}
            />
          )}
        </Tooltip>
      </Effect.FadeIn>

      <NoteTagsInputChips tags={selectedTags} tooltipProps={tooltipProps} />
    </Layout.Row>
  );
}

export default NoteTagsInput;
