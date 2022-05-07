import * as React from "react";

import { ResourceDocument } from "../../services";

import Layout from "../Layout";

export interface ListItem {
  id: ResourceDocument["id"];
}

export interface ListProps<P = any> {
  getKey: (item: P, index: number) => string;
  renderItem: (props: { item: P; index: number }) => JSX.Element;

  items?: P[];
  isEmpty?: (items: P[]) => boolean;
  renderEmpty?: () => JSX.Element;
}

export interface ResourceListProps<P extends ResourceDocument>
  extends ListProps<P> {}

function List<P = any>({
  items = [],
  renderItem,
  getKey,
  renderEmpty,
  isEmpty: isEmptyProp,
}: ListProps<P>) {
  const isEmpty = isEmptyProp ? isEmptyProp(items) : !items?.length;

  return (
    <React.Fragment>
      {items?.map((item, index) => (
        <React.Fragment key={getKey(item, index)}>
          {renderItem({ item, index })}
        </React.Fragment>
      ))}

      {isEmpty && renderEmpty?.()}
    </React.Fragment>
  );
}

export interface ListItemProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

function ListItem({ left, right, title, description }: ListItemProps) {
  return (
    <Layout.Row>
      {left}

      <Layout.Column>
        {title}
        {description}
      </Layout.Column>

      {right}
    </Layout.Row>
  );
}

List.Item = ListItem;

export default List;
