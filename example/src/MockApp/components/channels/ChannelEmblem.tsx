import * as React from "react";
import * as Icons from "react-bootstrap-icons";
import { Icon, IconProps } from "@jnesbella/body-builder";
import { startCase } from "lodash";

import { Channel } from "../../types";
import { getChannelIcon } from "./channels-utils";

export interface ChannelEmblemProps {
  channel: Channel;
  size?: IconProps["size"];
}

function ChannelEmblem({ channel, size }: ChannelEmblemProps) {
  const { emblem } = channel;

  switch (emblem?.type) {
    case "icon":
      return <Icon size={size} icon={getChannelIcon(channel)} />;

    case "emoji":
    default:
      return null;
  }
}

export default ChannelEmblem;
