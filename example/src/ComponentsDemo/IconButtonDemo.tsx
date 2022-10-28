import * as React from "react";
import { IconButton } from "@jnesbella/body-builder";
import styled from "styled-components/native";
import DemoTemplate from "./DemoTemplate";
import * as Icons from "react-bootstrap-icons";

function IconButtonDemo() {
  return (
    <DemoTemplate
      title="IconButton"
      examples={[
        () => <IconButton icon={Icons.Fonts} />,

        () => <IconButton size="small" icon={Icons.Fonts} />,
      ]}
    />
  );
}

export default IconButtonDemo;
