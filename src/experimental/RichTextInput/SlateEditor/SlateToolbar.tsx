import * as React from "react";
import styled from "styled-components";
import * as Icons from "react-bootstrap-icons";

import { Divider, Layout, Space } from "../../../components";

import MarkButton, { MarkButtonProps } from "./MarkButton";
import BlockButton, { BlockButtonProps } from "./BlockButton";
import { theme } from "../../../styles";

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
  const marks: {
    mark: MarkButtonProps["mark"];
    icon: MarkButtonProps["icon"];
  }[] = [
    { mark: "bold", icon: Icons.TypeBold },
    { mark: "italic", icon: Icons.TypeItalic },
    { mark: "underline", icon: Icons.TypeUnderline },
    { mark: "strikethrough", icon: Icons.TypeStrikethrough },
    { mark: "code", icon: Icons.Code },
  ];

  const blocks: {
    block: BlockButtonProps["block"];
    icon: BlockButtonProps["icon"];
  }[] = [
    // { block: "paragraph", icon: Icons.Paragraph },
    // { block: "heading", icon: Icons.Fonts },
    { block: "block-quote", icon: Icons.BlockquoteLeft },
    { block: "code", icon: Icons.CodeSlash },

    { block: "link", icon: Icons.Link },
    { block: "image", icon: Icons.Image },

    { block: "bullet-list", icon: Icons.ListUl },
    { block: "number-list", icon: Icons.ListOl },
    { block: "task-list", icon: Icons.ListCheck },
  ];

  const markButtons = (
    <React.Fragment>
      {marks.map(({ mark, icon }) => (
        <Layout.Box key={mark} spacingSize={[0.25, 0]}>
          <MarkButton disabled={disabled} mark={mark} icon={icon} />
        </Layout.Box>
      ))}
    </React.Fragment>
  );

  const blockButtons = (
    <React.Fragment>
      {blocks.map(({ block, icon }) => (
        <BlockButton
          key={block}
          block={block}
          disabled={disabled}
          icon={icon}
        />
      ))}
    </React.Fragment>
  );

  return (
    <Layout.Row spacingSize={[0, 0.5]} alignItems="center">
      {markButtons}

      <Space />

      <Divider vertical height={theme.spacing * 3} />

      <Space />

      {blockButtons}
    </Layout.Row>
  );

  // return <Container>{markButtons}</Container>;
}

export default SlateToolbar;
