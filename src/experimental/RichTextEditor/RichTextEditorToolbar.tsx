import * as React from "react";
import { Element } from "slate";

import { Divider, Layout, Space, Surface } from "../../components";
import { MarkType } from "../../slateTypings";
import { theme } from "../../styles";

import SlateEditor from "../SlateEditor";

function RichTextEditorToolbar() {
  const divider = (
    <React.Fragment>
      <Space />
      <Divider vertical height={theme.spacing * 2} />
      <Space />
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Surface background={theme.colors.backgroundInfo} fullWidth>
        <Layout.Row spacingSize={1} alignItems="center">
          {(["bold", "italic", "strikethrough"] as MarkType[]).map(
            (mark, i) => (
              <React.Fragment key={mark}>
                {i > 0 && <Space />}

                <SlateEditor.MarkButton mark={mark} />
              </React.Fragment>
            )
          )}

          {divider}

          {(["task-list"] as Element["type"][])
            // ["numbered-list", "bulleted-list", "task-list"] as Element["type"][]
            .map((block, i) => (
              <React.Fragment key={block}>
                {i > 0 && <Space />}

                <SlateEditor.BlockButton block={block} />
              </React.Fragment>
            ))}

          {/* {divider} */}

          {/* <SlateEditor.MarkButton mark="code" />

          <Space spacingSize={0.5} />

          <SlateEditor.BlockButton block="code" /> */}
        </Layout.Row>
      </Surface>

      <Divider background={theme.colors.transparent} />
    </React.Fragment>
  );
}

export default RichTextEditorToolbar;
