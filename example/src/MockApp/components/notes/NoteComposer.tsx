import * as React from "react";
import { Surface, Space, IconButton } from "@jnesbella/body-builder";
import * as Icons from "react-bootstrap-icons";

import { useCreateNote } from "../../hooks";

import NoteEditor, { NoteEditorElement } from "./NoteEditor";
import NoteLayout from "./NoteLayout";

function NoteComposer() {
  const ref = React.useRef<NoteEditorElement>(null);

  const { create: createNote, isCreating } = useCreateNote({
    onSuccess: () => {
      ref.current?.reset();
    },
  });

  const doCreate = () => {
    if (ref.current) {
      createNote(ref.current.getValue());
    }
  };

  const [elevation, setElevation] = React.useState(0);

  return (
    // <Surface fullWidth spacingSize={[3, 1]}>
    //   <NoteEditor
    //     ref={ref}
    //     elevation={elevation}
    //     disabled={isCreating}
    //     onFocus={() => setElevation(1)}
    //     onBlur={() => setElevation(0)}
    //     end={
    //       <IconButton
    //         icon={Icons.Send}
    //         onPress={doCreate}
    //         focusOn="none"
    //         focusable={false}
    //         size="small"
    //       />
    //     }
    //   />

    //   <Space spacingSize={2} />
    // </Surface>

    <NoteLayout
      spacingSizeBottom={1}
      content={
        // <RichTextEditor
        //   placeholder="Jot something down"
        //   value={note.content}
        //   disabled={!isEditing}
        // />

        <NoteEditor
          ref={ref}
          elevation={elevation}
          disabled={isCreating}
          onFocus={() => setElevation(1)}
          onBlur={() => setElevation(0)}
          end={
            <IconButton
              icon={Icons.Send}
              onPress={doCreate}
              focusOn="none"
              focusable={false}
              size="small"
            />
          }
        />
      }
    />
  );
}

export default NoteComposer;
