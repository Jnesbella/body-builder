import * as React from "react";
import {
  bordered,
  Layout,
  Text,
  Bordered,
  theme,
  Space,
  Surface,
} from "@jnesbella/body-builder";
import styled from "styled-components/native";
import DemoTemplate from "./DemoTemplate";

const Example1 = styled(Layout.Box)`
  ${bordered({ borderColor: theme.colors.primary, borderWidth: 2 })};
`;

const Example2 = styled(Layout.Box).attrs({
  borderColor: theme.colors.accent,
  borderWidth: 2,
})`
  ${bordered};
`;

const Example3 = styled(Layout.Box)<Bordered>`
  ${bordered};
`;

const Example4 = styled(Layout.Box)`
  ${bordered};
`;

function SurfaceDemo() {
  return (
    <DemoTemplate
      title="Surface"
      examples={[
        ({ children }) => <Surface>{children}</Surface>,

        () => (
          <Surface background={theme.colors.primaryLight}>
            <Layout.Box spacingSize={1}>
              <Text background={theme.colors.primaryLight}>Example 2</Text>
            </Layout.Box>
          </Surface>
        ),
      ]}
    />
  );
}

export default SurfaceDemo;
