import * as React from "react";
import {
  Layout,
  Surface,
  Measure,
  utcStringToDate,
  MeasureElement,
  useSetRef,
} from "@jnesbella/body-builder";
import { ScrollView } from "react-native";

import { useListNotes } from "../../hooks";
import { Note } from "../../types";
import NoteDivider from "./NoteDivider";
import NoteComponent from "./NoteComponent";

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
        scrollRef.current?.scrollToEnd();
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

    return (
      <Surface greedy>
        <ScrollView ref={scrollRef}>
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
