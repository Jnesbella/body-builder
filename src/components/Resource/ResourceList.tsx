import * as React from 'react'

import { Resource } from '../../services/ResourceService'

import List, { ListProps } from '../List'

export interface ResourceListProps<P extends Resource>
  extends Omit<ListProps<P>, 'getKey'> {}

function ResourceList<P extends Resource>(props: ResourceListProps<P>) {
  return <List<P> getKey={(item) => `${item.id}`} {...props} />
}

export default ResourceList
