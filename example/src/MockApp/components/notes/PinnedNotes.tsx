import * as React from "react";
import { Layout, Surface, Space, Button, Icon } from "@jnesbella/body-builder";
import { ScrollView } from "react-native";
import * as Icons from "react-bootstrap-icons";

import { useListPinnedNotes } from "../../hooks";
import { Note } from "../../types";

import NoteTitle from "./NoteTitle";

export interface PinnedNotesProps {
  onPressNote?: (note: Note) => void;
}

function PinnedNotes({ onPressNote }: PinnedNotesProps) {
  const { data: notes } = useListPinnedNotes();

  return (
    <Surface>
      <ScrollView horizontal>
        <Layout.Row spacingSize={1} alignItems="center">
          <Icon icon={Icons.BookmarkFill} />

          {notes?.map((note) => (
            <React.Fragment key={note.id}>
              <Space />

              <Button onPress={() => onPressNote?.(note)}>
                <NoteTitle note={note} />
              </Button>
            </React.Fragment>
          ))}
        </Layout.Row>
      </ScrollView>
    </Surface>
  );
}

export default PinnedNotes;
