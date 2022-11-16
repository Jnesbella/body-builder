import * as React from "react";
import { Layout, Info, Divider } from "@jnesbella/body-builder";

import { useListPinnedNotes } from "../hooks";

import PinnedNotes from "./notes/PinnedNotes";
import { NotesList, NotesListElement } from "./notes/NotesList";
import NoteEditor from "./notes/NoteEditor";
import Navigation from "./navigation/Navigation";
import { ChannelName, LabledBox, SearchBar } from "./components";
import NoteComposer from "./notes/NoteComposer";

function AppLayout() {
  const notesListRef = React.useRef<NotesListElement>(null);

  const { data: pinnedNotes } = useListPinnedNotes();

  return (
    <React.Fragment>
      {/* <Modal isVisible>
        <Text>Banana</Text>
      </Modal> */}

      <Info greedy>
        <Layout.Row greedy>
          <Navigation />

          <Divider vertical />

          <Layout.Column greedy>
            <SearchBar />

            <Divider />

            <Layout.Row greedy>
              <Layout.Column greedy>
                <ChannelName />

                {/* {pinnedNotes.length > 0 && (
                  <React.Fragment>
                    <PinnedNotes
                      onPressNote={(note) =>
                        notesListRef.current?.scrollToNote(note)
                      }
                    />

                    <Divider />
                  </React.Fragment>
                )} */}

                <NotesList ref={notesListRef} />

                <NoteComposer />
              </Layout.Column>

              <Divider vertical />

              <LabledBox label="Thread" maxWidth={300} />
            </Layout.Row>
          </Layout.Column>
        </Layout.Row>
      </Info>
    </React.Fragment>
  );
}

export default AppLayout;
