import * as React from "react";
import {
  Layout,
  IconButton,
  Space,
  Surface,
  Divider,
  Text,
  theme,
  Info,
  rounded,
} from "@jnesbella/body-builder";
import styled from "styled-components/native";
import * as Icons from "react-bootstrap-icons";
import { compact } from "lodash";

import { useAppActions, useAppState } from "../../hooks";
import { Filter, PinnedFilter, Search, Tag, TagFilter } from "../../types";
import NoteTagsInput from "../NoteTagsInput/NoteTagsInput";

const NoteFiltersContainer = styled(Layout.Box).attrs({
  spacingSize: [3, 1],
})``;

const FilterWrapper = styled(Surface).attrs({
  spacingSize: 0.5,
})`
  ${rounded({ roundness: theme.spacing * 2.5 })};
`;

const NoteFiltersWrapper = styled(Surface).attrs({
  background: theme.colors.backgroundInfo,
  spacingSize: [2.5, 0.5],
})`
  ${rounded({ roundness: theme.spacing * 2.5 })};
`;

const FILTER_PINNED: PinnedFilter = { filterBy: "pinned" };

function NoteFilters() {
  const setSearch = useAppActions((actions) => actions.setSearch);
  const search = useAppState((state) => state.search);

  const includePinned = search.filters.some(
    (filter) => filter.filterBy === "pinned"
  );

  const togglePinned = () => {
    const nextFilters = includePinned
      ? search.filters.filter((filter) => filter.filterBy !== "pinned")
      : [...search.filters, FILTER_PINNED];

    setSearch({
      ...search,
      filters: nextFilters,
    });
  };

  // const [includePinned, setIncludePinned] = React.useState(
  //   search.filters.some((filter) => filter.filterBy === "pinned")
  // );

  const tagIds = search.filters
    .filter((filter) => filter.filterBy === "tag")
    .map((filter) => (filter as TagFilter).tagId);

  const setTagIds = (tagIds: Tag["id"][]) => {
    const tagFilters: TagFilter[] = tagIds.map((tagId) => ({
      filterBy: "tag",
      tagId,
    }));

    const otherFilters = search.filters.filter(
      (filter) => filter.filterBy !== "tag"
    );

    const nextFilters: Filter[] = [...otherFilters, ...tagFilters];

    setSearch({
      ...search,
      filters: nextFilters,
    });
  };

  // const [tagIds, setTagIds] = React.useState<Tag["id"][]>([]);

  const tagFilters = React.useMemo<TagFilter[]>(
    () => tagIds.map((tagId) => ({ filterBy: "tag", tagId })),
    [tagIds]
  );

  // const filters = React.useMemo<Filter[]>(
  //   () => compact([includePinned ? FILTER_PINNED : undefined, ...tagFilters]),
  //   [includePinned, tagFilters]
  // );

  // React.useEffect(
  //   function handleSearchChange() {
  //     setSearch({ filters });
  //   },
  //   [setSearch, filters]
  // );

  return (
    <NoteFiltersContainer>
      <NoteFiltersWrapper elevation={1}>
        {/* <Layout.Column spacingSize={1}> */}
        {/* <Text.Label>Filters</Text.Label> */}

        <Layout.Row alignItems="center">
          <Text.Label>Filters</Text.Label>

          <Space spacingSize={2.5} />

          <FilterWrapper>
            <IconButton
              active={includePinned}
              icon={includePinned ? Icons.BookmarkFill : Icons.Bookmark}
              onPress={togglePinned}
              size="small"
              focusOn="none"
              focusable={false}
            />
          </FilterWrapper>

          <Space />

          <FilterWrapper>
            <NoteTagsInput
              onChange={setTagIds}
              value={tagIds}
              tooltipProps={{
                placement: "bottom",
                topOffset: theme.spacing,
              }}
            />
          </FilterWrapper>
        </Layout.Row>
        {/* </Layout.Column> */}
      </NoteFiltersWrapper>
    </NoteFiltersContainer>
  );
}

export default NoteFilters;
