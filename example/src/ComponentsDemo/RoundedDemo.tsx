import * as React from "react";
import {
  Layout,
  Rounded,
  rounded,
  bordered,
  Bordered,
} from "@jnesbella/body-builder";
import styled from "styled-components/native";
import DemoTemplate from "./DemoTemplate";

const Container = styled(Layout.Box)<Bordered>`
  ${bordered};
`;

const Example1 = styled(Container)`
  ${rounded({ roundness: 4 })};
`;

const Example2 = styled(Container).attrs({
  roundness: 4,
})`
  ${rounded};
`;

const Example3 = styled(Container)<Rounded>`
  ${rounded};
`;

const Example4 = styled(Container)`
  ${rounded};
`;

function RoundedDemo() {
  return (
    <DemoTemplate
      title="Rounded"
      examples={[
        ({ children }) => <Example1>{children}</Example1>,

        ({ children }) => <Example2>{children}</Example2>,

        ({ children }) => <Example3 roundness={10}>{children}</Example3>,

        ({ children }) => <Example4>{children}</Example4>,
      ]}
    />
  );
}

export default RoundedDemo;
