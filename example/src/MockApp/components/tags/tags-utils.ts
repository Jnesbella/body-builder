import { sortBy, startsWith } from "lodash";

import { Tag } from "../../types";

export const sortTagsByLabel = (tagsToSort: Tag[]) =>
  sortBy(tagsToSort, (tag) => tag.label);

export const searchTags = (tags: Tag[], search: string) =>
  tags.filter((tag) =>
    startsWith(tag.label.toLowerCase(), search.toLowerCase())
  );

export const isTagSelected = (tag: Tag, selectedTagIds: Tag["id"][]) =>
  selectedTagIds.some((tagId) => tagId === tag.id);
