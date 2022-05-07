import * as React from 'react'
import { uniqueId } from 'lodash'

import { AnimatedValueQuery } from './animatedValueTypes'

export const ANIMATED_VALUE_ID_PREFIX = 'animatedValue-'

export const makeAnimatedValueId = ({ id, name }: AnimatedValueQuery = {}) => {
  if (id) {
    return id
  }

  if (name) {
    return `${ANIMATED_VALUE_ID_PREFIX}${name}`
  }

  return uniqueId(ANIMATED_VALUE_ID_PREFIX)
}

function useAnimatedValueId(query?: AnimatedValueQuery) {
  const id = React.useMemo(() => makeAnimatedValueId(query), [query])

  return id
}

export default useAnimatedValueId
