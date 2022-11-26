import { startCase } from "lodash";
import * as React from "react";
import { Channel } from "../../types";

export interface ChannelNameProps {
  channel: Channel;
}

function ChannelName({ channel }: ChannelNameProps) {
  return <React.Fragment>{startCase(channel.name)}</React.Fragment>;
}

export default ChannelName;
