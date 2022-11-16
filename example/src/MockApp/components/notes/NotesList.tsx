import * as React from "react";
import {
  Layout,
  Surface,
  Measure,
  utcStringToDate,
  MeasureElement,
  useSetRef,
  Text,
  Divider,
} from "@jnesbella/body-builder";
import { ScrollView } from "react-native";

import { useListNotes, useListPinnedNotes } from "../../hooks";
import { Note } from "../../types";
import NoteDivider from "./NoteDivider";
import NoteComponent from "./NoteComponent";
import PinnedNotes from "./PinnedNotes";

export interface NotesListElement {
  scrollToNote: (note: Note) => void;
}

export interface NotesListProps {}

export const NotesList = React.forwardRef<NotesListElement, NotesListProps>(
  (_props, ref) => {
    const { data: notes } = useListNotes();

    const scrollRef = React.useRef<ScrollView>(null);

    const measureRefs: Record<
      Note["id"],
      React.Ref<MeasureElement> | undefined
    > = React.useMemo(() => {
      return notes.reduce(
        (acc, note) => ({
          ...acc,
          [note.id]: React.createRef<MeasureElement>(),
        }),
        {}
      );
    }, [notes]);

    const numNotes = notes?.length || 0;

    React.useEffect(
      function scrollToBottom() {
        scrollRef.current?.scrollToEnd({ animated: false });
      },
      [numNotes]
    );

    const isSameDay = (a: Note, b: Note) => {
      const dateA: Date = utcStringToDate(a.createdAt);
      const dateB: Date = utcStringToDate(b.createdAt);

      return (
        dateA.getDate() === dateB.getDate() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getFullYear() === dateB.getFullYear()
      );
    };

    const element: NotesListElement = {
      scrollToNote: (note: Note) => {
        const measureRef = measureRefs[note.id];
        if (measureRef && "current" in measureRef) {
          scrollRef.current?.scrollTo(measureRef.current?.rect?.y);
        }
      },
    };

    useSetRef(ref, element);

    const { data: pinnedNotes } = useListPinnedNotes();

    const hasPinnedNotes = pinnedNotes.length > 0;

    return (
      <Surface greedy>
        <ScrollView
          ref={scrollRef}
          stickyHeaderIndices={hasPinnedNotes ? [0] : undefined}
        >
          {/* {hasPinnedNotes && (
            <PinnedNotes onPressNote={(note) => element.scrollToNote(note)} />
          )} */}

          <Layout.Column>
            {notes?.map((note, index) => (
              <React.Fragment key={note.id}>
                {(index === 0 || !isSameDay(note, notes[index - 1])) && (
                  <NoteDivider note={note} />
                )}

                <Measure ref={measureRefs[note.id]}>
                  <NoteComponent note={note} />
                </Measure>
              </React.Fragment>
            ))}
          </Layout.Column>
        </ScrollView>
      </Surface>
    );
  }
);
