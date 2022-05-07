import { Resource } from '../../Services/ResourceService'

import { UseCRUD } from './resourceHookTypes'

import useCreate from './useCreate'
import useDelete from './useDelete'
import useRead from './useRead'
import useUpdate from './useUpdate'

function useCRUD<T extends Resource, K extends Resource = T>({
  service,
  id
}: UseCRUD<T>) {
  const create = useCreate<T, K>({ service, id })
  const read = useRead<T>({ service, id })
  const update = useUpdate<T, K>({ service, id })
  const deleteOne = useDelete<T>({ service, id })

  const isLoading =
    create.isCreating ||
    read.isReading ||
    update.isUpdating ||
    deleteOne.isDeleting

  return {
    ...create,
    ...read,
    ...update,
    ...deleteOne,
    isLoading
  }
}

export default useCRUD
