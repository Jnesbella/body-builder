import * as React from "react";
import {
  Layout,
  Text,
  Pressable,
  Surface,
  theme,
  RichTextEditor,
  utcStringToDate,
  PressableProviderElement,
  background,
} from "@jnesbella/body-builder";
import styled from "styled-components/native";

import { Note } from "../../types";

import NoteActions from "./NoteActions";

const NoteComponentWrapper = styled(Surface).attrs({
  fullWidth: true,
})<PressableProviderElement & { note: Note }>`
  position: relative;

  ${(props) =>
    background({
      background: props.hovered
        ? theme.colors.backgroundInfo
        : props.note.pinned
        ? theme.colors.primaryLight
        : theme.colors.background,
    })};
`;

function NoteComponent({ note }: { note: Note }) {
  const createdAt: Date = utcStringToDate(note.createdAt);

  return (
    <Pressable fullWidth>
      {(pressableProps) => (
        <NoteComponentWrapper {...pressableProps} note={note}>
          <Layout.Column spacingSize={[2, 1]}>
            <Layout.Row spacingSize={[1, 0]} alignItems="baseline">
              {/* <Text.SubHeader>Me</Text.SubHeader>

        <Space /> */}

              <Text.Caption>
                {`${createdAt.getHours()}:${createdAt.getMinutes()}`}
              </Text.Caption>
            </Layout.Row>

            <RichTextEditor
              placeholder="Jot something down"
              value={note.content}
              disabled
            />

            {pressableProps.hovered && <NoteActions note={note} />}
          </Layout.Column>
        </NoteComponentWrapper>
      )}
    </Pressable>
  );
}

export default NoteComponent;
