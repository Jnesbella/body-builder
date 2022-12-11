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

import { isTagSelected } from "../tags";

export interface NoteTagsInputMenuProps {
  tags?: Tag[];
  onPressTag?: (tag: Tag) => void;
  onCreateTag?: (label: string) => void;
  selectedTagIds?: Tag["id"][];
  numTagsVisible?: number;
  onSearchChange?: (search: string) => void;
  search?: string;
  createTagEnabled?: boolean;
}

function NoteTagsInputMenu({
  tags: allTags = [],
  onPressTag,
  onCreateTag,
  selectedTagIds = [],
  numTagsVisible = 5,
  search = "",
  onSearchChange,
  createTagEnabled: isCreateEnabled,
}: NoteTagsInputMenuProps) {
  const tags = allTags.slice(0, numTagsVisible);

  const isEmpty = tags.length === 0;

  const handlePressCreate = () => onCreateTag?.(search);

  const emptyMessage = (
    <Layout.Box spacingSize={[1, 0.5]}>
      <Text.Caption>No tags found</Text.Caption>
    </Layout.Box>
  );

  return (
    <Menu elevation={1}>
      <Layout.Column spacingSize={[0, 1]}>
        <Layout.Box spacingSize={[1, 0]}>
          <Text.Caption>Tags</Text.Caption>
        </Layout.Box>

        <Layout.Box spacingSize={[0, 1]}>
          <TextInput
            value={search}
            onChangeText={onSearchChange}
            placeholder="Filter tags"
            autoFocus
          />
        </Layout.Box>

        {isEmpty && emptyMessage}

        {tags?.map((tag) => {
          const isSelected = isTagSelected(tag, selectedTagIds);

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
