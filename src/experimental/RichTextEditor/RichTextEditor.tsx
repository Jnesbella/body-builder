import * as React from "react";
import { Element } from "slate";
import { Divider, Layout, Space, Surface } from "../../components";
import { MarkType } from "../../slateTypings";
import { theme } from "../../styles";

import SlateEditor, {
  SlateEditorProps,
  SlateEditorElement,
} from "../SlateEditor";
import { MARK_TYPES } from "../SlateEditor/slateConstants";

export interface RichTextEditorElement extends SlateEditorElement {}

export interface RichTextEditorProps extends SlateEditorProps {}

const RichTextEditor = React.forwardRef<
  RichTextEditorElement,
  RichTextEditorProps
>(({ ...editorProps }, ref) => {
  return (
    <SlateEditor.Provider>
      <SlateEditor
        {...editorProps}
        ref={ref}
        above={
          <React.Fragment>
            <Surface background={theme.colors.backgroundInfo} fullWidth>
              <Layout.Row spacingSize={[0.5, 1]} alignItems="center">
                {(["bold", "italic", "strikethrough"] as MarkType[]).map(
                  (mark, i) => (
                    <React.Fragment key={mark}>
                      {i > 0 && <Space spacingSize={0.5} />}

                      <SlateEditor.MarkButton mark={mark} />
                    </React.Fragment>
                  )
                )}

                <Space spacingSize={0.5} />
                <Divider vertical height={theme.spacing * 2} />
                <Space spacingSize={0.5} />

                {(["numbered-list", "bulleted-list"] as Element["type"][]).map(
                  (block, i) => (
                    <React.Fragment key={block}>
                      {i > 0 && <Space spacingSize={0.5} />}

                      <SlateEditor.BlockButton block={block} />
                    </React.Fragment>
                  )
                )}

                <Space spacingSize={0.5} />
                <Divider vertical height={theme.spacing * 2} />
                <Space spacingSize={0.5} />

                <SlateEditor.MarkButton mark="code" />

                <Space spacingSize={0.5} />

                <SlateEditor.BlockButton block="code" />
              </Layout.Row>
            </Surface>

            <Divider background={theme.colors.transparent} />
          </React.Fragment>
        }
      />
    </SlateEditor.Provider>
  );
});

export default RichTextEditor;
