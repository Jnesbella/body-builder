import ResourceService, { Resource } from '../../Services/ResourceService'

export interface UseCRUD<T extends Resource> {
  service: ResourceService<T>
  id?: Resource['id']
}
