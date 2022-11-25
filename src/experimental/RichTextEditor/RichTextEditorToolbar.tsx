import * as React from "react";
import { Element } from "slate";
import styled from "styled-components/native";

import {
  Divider,
  Layout,
  Space,
  Surface,
  Bordered,
  Rounded,
  rounded,
  spacing,
  background,
} from "../../components";
import { MarkType } from "../../slateTypings";
import { theme } from "../../styles";

import SlateEditor from "../SlateEditor";

const ToolbarActionsWrapper = styled(Layout.Row).attrs({
  // background: theme.colors.transparent,
})<Bordered & Rounded>`
  ${rounded({ roundness: theme.spacing * 2 })};
  ${spacing({ spacingSize: 0.5 })};
  ${background({ background: theme.colors.background })};
`;

export interface RichTextEditorToolbarProps {
  end?: React.ReactNode;
}

function RichTextEditorToolbar({ end }: RichTextEditorToolbarProps) {
  const space = <Space spacingSize={0.5} />;

  const divider = (
    <React.Fragment>
      {/* {space} */}
      {/* <Divider vertical height={theme.spacing * 3} /> */}
      {/* {space} */}
      <Space spacingSize={1} />
    </React.Fragment>
  );

  return (
    // <Surface background={theme.colors.backgroundInfo} fullWidth>
    <Layout.Row alignItems="center">
      <ToolbarActionsWrapper>
        {(["bold", "italic", "strikethrough"] as MarkType[]).map((mark, i) => (
          <React.Fragment key={mark}>
            {i > 0 && space}

            <SlateEditor.MarkButton mark={mark} />
          </React.Fragment>
        ))}
      </ToolbarActionsWrapper>

      {divider}

      <ToolbarActionsWrapper>
        {(["task-list"] as Element["type"][])
          // ["numbered-list", "bulleted-list", "task-list"] as Element["type"][]
          .map((block, i) => (
            <React.Fragment key={block}>
              {i > 0 && space}

              <SlateEditor.BlockButton block={block} />
            </React.Fragment>
          ))}
      </ToolbarActionsWrapper>

      {/* {divider} */}

      {/* <SlateEditor.MarkButton mark="code" />

          <Space spacingSize={0.5} />

          <SlateEditor.BlockButton block="code" /> */}

      {end}
    </Layout.Row>
    // </Surface>
  );
}

export default RichTextEditorToolbar;
