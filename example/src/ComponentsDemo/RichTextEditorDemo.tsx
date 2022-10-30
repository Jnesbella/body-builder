import * as React from "react";
import {
  Button,
  IconButton,
  RichTextEditor,
  RichTextEditorElement,
  Text,
} from "@jnesbella/body-builder";
import styled from "styled-components/native";
import DemoTemplate from "./DemoTemplate";
import * as Icons from "react-bootstrap-icons";

function RichTextEditorDemo() {
  const ref = React.useRef<RichTextEditorElement>(null);

  return (
    <React.Fragment>
      <Button onPress={() => ref.current?.clear()}>
        <Button.Text>Clear</Button.Text>
      </Button>

      <DemoTemplate
        title="RichTextEditor"
        examples={[
          () => <RichTextEditor ref={ref} placeholder="Jot something down" />,
        ]}
      />
    </React.Fragment>
  );
}

export default RichTextEditorDemo;
