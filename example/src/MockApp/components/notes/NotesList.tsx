import * as React from "react";
import {
  Layout,
  Surface,
  Measure,
  utcStringToDate,
  MeasureElement,
  useSetRef,
  ScrollView,
  ScrollViewElement,
  Text,
  useScrollViewState,
} from "@jnesbella/body-builder";

import { useListNotes } from "../../hooks";
import { Note } from "../../types";

import NoteDivider from "./NoteDivider";
import NoteComponent from "./NoteComponent";
import NoteFilters from "./NoteFilters";

interface ScrollViewUtilProps {
  children: (topOffset: number) => React.ReactNode;
}

function ScrollViewUtil({ children }: ScrollViewUtilProps) {
  const topOffset = useScrollViewState((state) => state.contentOffset?.y || 0);

  return <React.Fragment>{children(topOffset)}</React.Fragment>;
}

export interface NotesListElement {
  scrollToNote: (note: Note) => void;
}

export interface NotesListProps {}

const NotesList = React.forwardRef<NotesListElement, NotesListProps>(
  (_props, ref) => {
    const { data: notes } = useListNotes();

    const scrollRef = React.useRef<ScrollViewElement>(null);

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

    // const { data: pinnedNotes } = useListPinnedNotes();

    // const hasPinnedNotes = pinnedNotes.length > 0;

    const isEmpty = numNotes === 0;

    const emptyNotesMessage = (
      <Layout.Column
        spacingSize={[3, 1]}
        greedy
        alignItems="center"
        justifyContent="center"
      >
        {/* <Layout.Box greedy /> */}

        <Text.Caption>No notes found</Text.Caption>
      </Layout.Column>
    );

    return (
      <Surface greedy>
        <ScrollView
          ref={scrollRef}
          stickyHeaderIndices={[0]}
          contentContainerStyle={isEmpty && { flex: 1 }}
          // stickyHeaderIndices={hasPinnedNotes ? [0] : undefined}
        >
          {/* {hasPinnedNotes && (
      <PinnedNotes onPressNote={(note) => element.scrollToNote(note)} />
    )} */}

          <NoteFilters />

          {/* <Layout.Column greedy={isEmpty}> */}
          {isEmpty && emptyNotesMessage}

          {notes?.map((note, index) => (
            <React.Fragment key={note.id}>
              {(index === 0 || !isSameDay(note, notes[index - 1])) && (
                <NoteDivider note={note} />
              )}

              <Measure ref={measureRefs[note.id]}>
                <ScrollViewUtil>
                  {(topOffset) => (
                    <NoteComponent note={note} topOffset={-topOffset} />
                  )}
                </ScrollViewUtil>
              </Measure>
            </React.Fragment>
          ))}
          {/* </Layout.Column> */}
        </ScrollView>
      </Surface>
    );
  }
);

export default NotesList;
