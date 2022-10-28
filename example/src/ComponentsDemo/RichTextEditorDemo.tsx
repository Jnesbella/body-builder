import * as React from "react";
import { IconButton } from "@jnesbella/body-builder";
import styled from "styled-components/native";
import DemoTemplate from "./DemoTemplate";
import * as Icons from "react-bootstrap-icons";

function RichTextEditorDemo() {
  return (
    <DemoTemplate
      title="RichTextEditor"
      examples={
        [
          // () => <IconButton icon={Icons.Fonts} />,
        ]
      }
    />
  );
}

export default RichTextEditorDemo;
