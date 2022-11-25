import * as React from "react";
import {
  useList,
  useCreate,
  useQueryUtils,
  useUpdate,
  OnMutationSuccess,
  UpdateOne,
} from "@jnesbella/body-builder";
import { AppActionsContext, AppStateContext } from "../common/contexts";

import { notesService, channelsService, tagsService } from "../constants";
import {
  AppActions,
  AppState,
  Channel,
  Filter,
  Note,
  Tag,
  TagFilter,
} from "../types";
import { get } from "lodash";

export function useListNotes() {
  const notesList = useList<Note>({
    service: notesService,
  });

  const { data: notes } = notesList;

  const search = useAppState((state) => state.search);
  const { filters } = search;

  const filterNote = (note: Note) => {
    if (filters.length === 0) {
      return true;
    }

    return filters.some((filter) => {
      switch (filter.filterBy) {
        case "tag":
          return note.tagIds?.includes(filter.tagId);

        case "pinned":
          return note.pinned;

        default:
          return false;
      }
    });
  };

  return { ...notesList, data: notes.filter(filterNote) };
}

export function useListPinnedNotes() {
  const notesList = useListNotes();

  const { data: notes } = notesList;

  const pinnedNotes = React.useMemo(
    () => notes?.filter((note) => note.pinned),
    [notes]
  );

  return { ...notesList, data: pinnedNotes };
}

export function useCreateNote({
  onSuccess,
}: { onSuccess?: (note: Note) => void } = {}) {
  const { updateListQueryDataToAppendItem } = useQueryUtils();

  const createNote = useCreate<Note>({
    service: notesService,
    onSuccess: (note) => {
      updateListQueryDataToAppendItem(notesService.getQueryKey(), note);
      onSuccess?.(note);
    },
  });

  return createNote;
}

export function useUpdateNote({
  onSuccess,
}: {
  onSuccess?: OnMutationSuccess<Note, unknown, UpdateOne<Note>>;
} = {}) {
  const { updateListQueryDataToSetItem } = useQueryUtils();

  const updateNote = useUpdate<Note>({
    service: notesService,
    onSuccess: (nextNote, variables, context) => {
      updateListQueryDataToSetItem(notesService.getQueryKey(), nextNote);

      onSuccess?.(nextNote, variables, context);
    },
  });

  return updateNote;
}

export function useListTags() {
  const tagsList = useList({
    service: tagsService,
  });

  return tagsList;
}

export function useCreateTag({
  onSuccess,
}: { onSuccess?: (tag: Tag) => void } = {}) {
  const { updateListQueryDataToAppendItem } = useQueryUtils();

  const createTag = useCreate({
    service: tagsService,
    onSuccess: (tag) => {
      updateListQueryDataToAppendItem(tagsService.getQueryKey(), tag);
      onSuccess?.(tag);
    },
  });

  return createTag;
}

export function useAppState<Output>(
  selector: (state: AppState) => Output
): Output {
  const state = React.useContext(AppStateContext);

  if (!state) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }

  return selector(state);
}

export function useAppActions<Output>(
  selector: (actions: AppActions) => Output
): Output {
  const actions = React.useContext(AppActionsContext);

  if (!actions) {
    throw new Error("useAppActions must be used within an AppActionsProvider");
  }

  return selector(actions);
}

export function useListChannels() {
  // const channelsList = useList({
  //   service: channelsService,
  // });

  const { data: tags, ...rest } = useListTags();

  const _channels = React.useMemo(() => {
    const tagToTagFilter = (tag: Tag): TagFilter => ({
      filterBy: "tag",
      tagId: tag.id,
    });

    const _tagToChannel = (tag: Tag): Channel => ({
      id: tag.id,
      name: tag.label,
      filters: [tagToTagFilter(tag)],
    });

    let channels: Channel[] = []; // tags.map(tagToChannel);

    const allFilter = {
      id: "all",
      name: "all",
      filters: [],
    };
    channels = [allFilter, ...channels];

    return channels;
  }, [tags]);

  return { ...rest, data: _channels };
}

export const useSelectedChannelId = () => {
  const search = useAppState((state) => state.search);
  const channelId = get(search, "id");

  return channelId;
};

export function useTagIdsFromSearch() {
  const { data: channels } = useListChannels();

  const channelId = useSelectedChannelId();

  const channel = channels.find((channel) => channel.id === channelId);

  const _tagIds = React.useMemo(() => {
    const { filters = [] } = channel || {};

    const isTagFilter = (filter: Filter) => filter.filterBy === "tag";

    const toTagId = (filter: TagFilter) => filter.tagId;

    const tagIds = filters
      .filter(isTagFilter)
      .map((filter) => toTagId(filter as TagFilter));

    return tagIds || [];
  }, [channel]);

  return _tagIds;
}
