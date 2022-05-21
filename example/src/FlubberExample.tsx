import * as React from "react";
import { Layout, Flubber, Info, Space } from "body-builder";

const LEFT_NAME = "left";
const MIDDLE_NAME = "middle";
const RIGHT_NAME = "right";

const LEFT = {
  name: LEFT_NAME,
};

const MIDDLE = {
  name: MIDDLE_NAME,
};

const MIDDLE_HEIGHT = {
  name: MIDDLE_NAME + "-height",
};

const LEFT_HEIGHT = {
  name: LEFT_NAME + "-height",
};

const RIGHT = {
  name: RIGHT_NAME,
};

const RIGHT_HEIGHT = {
  name: RIGHT_NAME + "-height",
};

const SLIDE_WIDTH = 300;

function FlubberExample() {
  return (
    <Layout.Row greedy>
      <Space />

      <Flubber width={LEFT} height={LEFT_HEIGHT} greedy="height">
        <Info greedy />
      </Flubber>

      <Flubber.Slide
        width={RIGHT}
        height={RIGHT_HEIGHT}
        gripPlacement="before"
        gripTo={LEFT}
        defaultIsOpen
        greedy="height"
      >
        <Info greedy />
      </Flubber.Slide>

      <Space />
    </Layout.Row>
  );
}

export default FlubberExample;
