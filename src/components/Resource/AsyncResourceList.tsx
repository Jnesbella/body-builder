import * as React from "react";
import { UseQueryResult } from "react-query";

import { ResourceDocument } from "../../services";

import { ListItem } from "../List";

import List, { ResourceListProps } from "./ResourceList";

export type AsyncListProps<P extends ResourceDocument> = UseQueryResult<
  P[],
  unknown
> &
  Omit<ResourceListProps<P>, "items">;

function AsyncResourceList<P extends ListItem = ListItem>({
  renderItem,
  renderEmpty,
  isEmpty,
  data,
}: // ...asyncProps
AsyncListProps<P>) {
  return (
    <List<P>
      items={data}
      renderItem={renderItem}
      renderEmpty={renderEmpty}
      isEmpty={isEmpty}
    />
  );
}

export default AsyncResourceList;
