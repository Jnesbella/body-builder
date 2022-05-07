import { isNumber } from 'lodash'
import * as React from 'react'
import { Animated } from 'react-native'

import { useWatchAnimatedValue } from '../../hooks'
import { useAnimatedValueListener } from '../../hooks'

export interface UsePushAndPull {
  enabled?: boolean
  target: Animated.Value
  source: Animated.Value
}

function usePushAndPull({ enabled = true, target, source }: UsePushAndPull) {
  const value = useWatchAnimatedValue(source)

  const valueRef = React.useRef<number>()
  const enabledRef = React.useRef(enabled)
  const shouldExtractOffset = enabled && !enabledRef.current
  const shouldFlattenOffset = !enabled && enabledRef.current

  const callback = React.useCallback(
    ({ value: nextValue }: { value: number }) => {
      if (isNumber(valueRef.current)) {
        const delta = valueRef.current - nextValue

        if (shouldExtractOffset) {
          target.extractOffset()
        }

        if (enabled) {
          target.setValue(delta)
        }

        if (shouldFlattenOffset) {
          target.setValue(delta)
          target.flattenOffset()
        }
      }
    },
    [enabled, shouldExtractOffset, shouldFlattenOffset, target]
  )

  useAnimatedValueListener(source, callback)

  React.useEffect(
    function handleValueChange() {
      if (!enabled) {
        valueRef.current = value
      }
    },
    [enabled, value]
  )

  React.useEffect(
    function handleEnabledChange() {
      enabledRef.current = enabled
    },
    [enabled]
  )
}

export default usePushAndPull
