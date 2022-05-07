import * as React from "react";

import { ResourceDocument } from "../../services";

import List, { ListProps } from "../List";

export interface ResourceListProps<P extends ResourceDocument>
  extends Omit<ListProps<P>, "getKey"> {}

function ResourceList<P extends ResourceDocument>(props: ResourceListProps<P>) {
  return <List<P> getKey={(item) => `${item.id}`} {...props} />;
}

export default ResourceList;
