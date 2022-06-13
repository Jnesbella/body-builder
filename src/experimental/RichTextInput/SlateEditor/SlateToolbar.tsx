import * as React from "react";
import styled from "styled-components";
import { faBold } from "@fortawesome/free-solid-svg-icons/faBold";
// import { faItalic } from "@fortawesome/free-solid-svg-icons/faItalic";
// import { faUnderline } from "@fortawesome/free-solid-svg-icons/faUnderline";
// import { faStrikethrough } from "@fortawesome/free-solid-svg-icons/faStrikethrough";
// import { faCode } from "@fortawesome/free-solid-svg-icons/faCode";
// import { faHeading } from "@fortawesome/free-solid-svg-icons/faHeading";
// import { faHighlighter } from "@fortawesome/free-solid-svg-icons/faHighlighter";
// import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons/faQuoteLeft";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

import { Divider, Layout } from "../../../components";

import MarkButton from "./MarkButton";
import BlockButton from "./BlockButton";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export interface SlateToolbarProps {
  disabled?: boolean;
}

function SlateToolbar({ disabled }: SlateToolbarProps) {
  const markButtons = (
    <React.Fragment>
      <MarkButton
        disabled={disabled}
        mark="bold"
        tooltip="Bold"
        icon={faBold}
      />

      {/* <MarkButton
        disabled={disabled}
        mark="italic"
        tooltip="Italic"
        icon={solid("italic")}
      />

      <MarkButton
        disabled={disabled}
        mark="underline"
        tooltip="Underlined"
        icon={solid("underline")}
      />

      <MarkButton
        disabled={disabled}
        mark="strikethrough"
        tooltip="Strikthrough"
        icon={solid("strikethrough")}
      />

      <MarkButton
        disabled={disabled}
        mark="code"
        tooltip="Code"
        icon={solid("code")}
      /> */}
    </React.Fragment>
  );

  const blockButtons = (
    <React.Fragment>
      {/* <BlockButton
        disabled={disabled}
        block="paragraph"
        tooltip="Normal"
        icon={solid("text")}
      />

      <BlockButton
        disabled={disabled}
        block="heading"
        tooltip="Heading"
        icon={solid("heading")}
      />

      <BlockButton
        disabled={disabled}
        block="block-quote"
        tooltip="Quote"
        icon={solid("block-quote")}
      />

      <BlockButton
        disabled={disabled}
        block="bulleted-list"
        tooltip="Bulleted List"
        icon={solid("list")}
      />

      <BlockButton
        disabled={disabled}
        block="numbered-list"
        tooltip="Numbered List"
        icon={solid("list-ol")}
      />

      <BlockButton
        disabled={disabled}
        block="task-list"
        tooltip="Task List"
        icon={solid("list-check")}
      /> */}
    </React.Fragment>
  );

  {
    /* <.Row>
      {markButtons}

       <Divider vertical />

       {blockButtons}
     </Layout.Row>Layout */
  }

  return <Container>{markButtons}</Container>;
}

export default SlateToolbar;
