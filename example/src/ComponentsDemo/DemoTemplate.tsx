import * as React from "react";
import { Layout, Text, Space, Surface } from "@jnesbella/body-builder";

interface ExampleProps {
  children?: React.ReactNode;
}

export type ExampleRenderer = (
  props: ExampleProps
) => JSX.Element | React.ReactNode;

export interface DemoTemplateProps {
  title: string;
  examples: ExampleRenderer[];
}

function DemoTemplate({ title, examples }: DemoTemplateProps) {
  return (
    <Surface fullWidth>
      <Layout.Column spacingSize={1} fullWidth>
        <Text.Label>{title}</Text.Label>

        {examples.map((example, index) => (
          <React.Fragment key={[title, "example", index].join("-")}>
            <Space />

            {example({
              children: (
                <Layout.Box spacingSize={1}>
                  <Text>Example {index + 1}</Text>
                </Layout.Box>
              ),
            })}
          </React.Fragment>
        ))}
      </Layout.Column>
    </Surface>
  );
}

export default DemoTemplate;
