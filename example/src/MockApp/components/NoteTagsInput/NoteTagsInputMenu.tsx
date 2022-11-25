import * as React from "react";
import {
  Menu,
  TextInput,
  Text,
  Layout,
  Divider,
  Icon,
  ICON_SIZE_SMALL,
  theme,
  Space,
} from "@jnesbella/body-builder";
import * as Icons from "react-bootstrap-icons";
import { Tag } from "../../types";
import { sortBy, startsWith } from "lodash";

export interface NoteTagsInputMenuProps {
  tags?: Tag[];
  selectedTags?: Tag[];
  onPressTag?: (tag: Tag) => void;
  onCreateTag?: (label: string) => void;
  selectedTagIds?: Tag["id"][];
  numTagsVisible?: number;
  minSearchLength?: number;
}

function NoteTagsInputMenu({
  tags = [],
  selectedTags = [],
  onPressTag,
  onCreateTag,
  selectedTagIds: selectedTagIdsProp,
  numTagsVisible = 5,
  minSearchLength = 2,
}: NoteTagsInputMenuProps) {
  const selectedTagIds =
    selectedTagIdsProp || selectedTags.map((tag) => tag.id);

  const [search, setSearch] = React.useState("");

  const isSearchEnabled = search.length >= minSearchLength;
  const isCreateEnabled = isSearchEnabled;

  const unselectedTags = tags.filter((tag) => !selectedTagIds.includes(tag.id));

  const isTagSelected = (tag: Tag) =>
    selectedTagIds.some((tagId) => tagId === tag.id);

  const handlePressCreate = () => onCreateTag?.(search);

  const sortTagsByLabel = (tagsToSort: Tag[]) =>
    sortBy(tagsToSort, (tag) => tag.label);

  const [defaultSortedTags, setDefaultSortedTags] = React.useState<Tag[]>([]);

  React.useEffect(() => {
    setDefaultSortedTags([
      ...sortTagsByLabel(selectedTags),
      ...sortTagsByLabel(unselectedTags),
    ]);
  }, []);

  const sortTagsBySearch = () =>
    sortTagsByLabel(tags.filter((tag) => startsWith(tag.label, search)));

  const sortedTags = isSearchEnabled ? sortTagsBySearch() : defaultSortedTags;

  const displayTags = sortedTags.slice(0, numTagsVisible);

  return (
    <Menu elevation={1}>
      <Layout.Column spacingSize={[0, 1]}>
        <Layout.Box spacingSize={[1, 0]}>
          <Text.Caption>Tags</Text.Caption>
        </Layout.Box>

        <Layout.Box spacingSize={[0, 1]}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Filter tags"
            autoFocus
          />
        </Layout.Box>

        {displayTags?.map((tag) => {
          const isSelected = isTagSelected(tag);

          return (
            <Menu.Item
              key={tag.id}
              fullWidth
              focusOn="none"
              focusable={false}
              onPress={() => onPressTag?.(tag)}
            >
              <Layout.Row alignItems="center">
                <Icon icon={Icons.Hash} />

                <Text>{tag.label}</Text>

                <Layout.Box greedy />

                <Space />

                <Layout.Box
                  style={{
                    opacity: isSelected ? 1 : 0.3,
                  }}
                >
                  <Icon
                    icon={Icons.Check}
                    color={
                      isSelected
                        ? theme.colors.primary
                        : theme.colors.textPlaceholder
                    }
                  />
                </Layout.Box>
              </Layout.Row>
            </Menu.Item>
          );
        })}

        {isCreateEnabled && (
          <React.Fragment>
            <Layout.Box spacingSize={[0, 1]}>
              <Divider />
            </Layout.Box>

            <Menu.Item fullWidth onPress={handlePressCreate}>
              <Layout.Row alignItems="center">
                <Icon
                  icon={Icons.Plus}
                  size={ICON_SIZE_SMALL}
                  color={theme.colors.textPlaceholder}
                />

                <Space spacingSize={0.5} />

                <Text.Caption>Create new tag "{search}"</Text.Caption>
              </Layout.Row>
            </Menu.Item>
          </React.Fragment>
        )}
      </Layout.Column>
    </Menu>
  );
}

export default NoteTagsInputMenu;
