import * as Icons from "react-bootstrap-icons";
import { startCase } from "lodash";

import { Channel } from "../../types";

export const getChannelIcon = (channel: Channel) => {
  const { emblem } = channel;

  return emblem && emblem.type === "icon"
    ? Icons[startCase(emblem.icon).replace(/\s/g, "")]
    : undefined;
};
