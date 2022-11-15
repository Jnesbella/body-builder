import * as React from "react";
import {
  Layout,
  Surface,
  Space,
  Button,
  Icon,
  theme,
  Text,
  rounded,
} from "@jnesbella/body-builder";
import { ScrollView } from "react-native";
import * as Icons from "react-bootstrap-icons";

import { useListPinnedNotes } from "../../hooks";
import { Note } from "../../types";

import NoteTitle from "./NoteTitle";
import styled from "styled-components/native";
import { Chip } from "../common";

const PinnedNotesWrapper = styled(Surface)`
  ${rounded({ roundness: theme.spacing * 4 })};
`;

export interface PinnedNotesProps {
  onPressNote?: (note: Note) => void;
}

function PinnedNotes({ onPressNote }: PinnedNotesProps) {
  const { data: notes } = useListPinnedNotes();

  return (
    <Layout.Box spacingSize={[2, 1]}>
      <PinnedNotesWrapper elevation={1}>
        <Surface>
          <ScrollView horizontal>
            <Layout.Row spacingSize={[3, 1]} alignItems="center">
              <Layout.Box spacingSize={1}>
                <Icon icon={Icons.BookmarkFill} />
              </Layout.Box>

              {notes?.map((note) => (
                <React.Fragment key={note.id}>
                  <Space />

                  <Chip
                    background={theme.colors.primaryLight}
                    onPress={() => onPressNote?.(note)}
                  >
                    <NoteTitle
                      note={note}
                      // background={theme.colors.primaryLight}
                      renderText={Text.Label}
                    />
                  </Chip>
                </React.Fragment>
              ))}
            </Layout.Row>
          </ScrollView>
        </Surface>
      </PinnedNotesWrapper>
    </Layout.Box>
  );
}

export default PinnedNotes;
