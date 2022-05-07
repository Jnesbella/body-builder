import * as React from 'react'
import { noop, debounce } from 'lodash'

function useAutosave<Output extends (...args: any) => any>(
  onSave: Output,
  {
    wait = 600
  }: {
    wait?: number
  } = {}
) {
  const save = React.useMemo(() => debounce(onSave, wait), [onSave, wait])

  return save
}

export default useAutosave
