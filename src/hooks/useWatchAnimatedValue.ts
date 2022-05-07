import * as React from 'react'
import { Animated } from 'react-native'
import useAnimatedValueListener from './useAnimatedValueListener'

function useWatchAnimatedValue(
  animatedValue?: Animated.Value,
  defaultValue: number = 0
) {
  const [value, setValue] = React.useState<number>(defaultValue)

  const onAnimatedValueChange = React.useCallback(
    ({ value: nextValue }: { value: number }) => {
      setValue(nextValue)
    },
    []
  )

  useAnimatedValueListener(animatedValue, onAnimatedValueChange)

  return value
}

export default useWatchAnimatedValue
