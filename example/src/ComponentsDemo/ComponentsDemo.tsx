import * as React from "react";
import {
  Layout,
  Space,
  Surface,
  theme,
  Pressable,
} from "@jnesbella/body-builder";

import BorderedDemo from "./BorderedDemo";
import RoundedDemo from "./RoundedDemo";
import SurfaceDemo from "./SurfaceDemo";
import RichTextEditorDemo from "./RichTextEditorDemo";
import IconButtonDemo from "./IconButtonDemo";

function ComponentsDemo() {
  const examples = [
    // <BorderedDemo />,
    // <RoundedDemo />,
    // <SurfaceDemo />,
    // <IconButtonDemo />,
    <RichTextEditorDemo />,
  ];

  return (
    <Pressable.Provider>
      <Surface background={theme.colors.backgroundInfo} fullWidth>
        <Layout.Column spacingSize={1} fullWidth>
          {examples.map((example, index) => (
            <React.Fragment key={["demo", index].join("-")}>
              {index > 0 && <Space />}

              {example}
            </React.Fragment>
          ))}
        </Layout.Column>
      </Surface>
    </Pressable.Provider>
  );
}

export default ComponentsDemo;
