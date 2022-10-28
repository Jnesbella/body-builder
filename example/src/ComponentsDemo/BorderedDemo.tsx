import * as React from "react";
import {
  bordered,
  Layout,
  Text,
  Bordered,
  theme,
  Space,
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

function BorderedDemo() {
  return (
    <DemoTemplate
      title="Bordered"
      examples={[
        ({ children }) => <Example1>{children}</Example1>,

        ({ children }) => <Example2>{children}</Example2>,

        ({ children }) => (
          <Example3 borderColor={theme.colors.black} borderWidth={2}>
            {children}
          </Example3>
        ),

        ({ children }) => <Example4>{children}</Example4>,
      ]}
    />

    // <Layout.Column spacingSize={1}>
    //   <Text.Label>Bordered</Text.Label>

    //   <Space />

    //   <Example1>
    //     <Text>Example 1</Text>
    //   </Example1>

    //   <Space />

    //   <Example2>
    //     <Text>Exampe 2</Text>
    //   </Example2>

    //   <Space />

    //   <Example3 borderColor={theme.colors.black} borderWidth={2}>
    //     <Text>Example 3</Text>
    //   </Example3>

    //   <Space />

    //   <Example4>
    //     <Text>Example 4</Text>
    //   </Example4>
    // </Layout.Column>
  );
}

export default BorderedDemo;
