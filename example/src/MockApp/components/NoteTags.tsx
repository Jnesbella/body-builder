import * as React from "react";
import { Space, Layout } from "@jnesbella/body-builder";

import { Note } from "../types";
import { useAppActions, useListChannels, useListTags } from "../hooks";

import { Chip } from "./common";

export interface NoteTagsProps {
  note: Note;
}

function NoteTags({ note }: NoteTagsProps) {
  const { tagIds = [] } = note;

  const { data: tags } = useListTags();

  const noteTags = tags.filter((tag) => tagIds.includes(tag.id));

  const { data: channels } = useListChannels();

  const setSearch = useAppActions((actions) => actions.setSearch);

  return (
    <Layout.Row alignItems="center">
      {noteTags.map((tag, index) => (
        <React.Fragment key={tag.id}>
          {index > 0 && <Space />}

          <Chip
            label={tag.label}
            size="small"
            onPress={() => {
              const channel = channels.find(
                (channel) => channel.name === tag.label
              );

              if (channel) {
                setSearch(channel);
              }
            }}
          />
        </React.Fragment>
      ))}
    </Layout.Row>
  );
}

export default NoteTags;
