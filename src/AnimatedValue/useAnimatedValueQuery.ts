import { useQuery } from 'react-query'
import { Animated } from 'react-native'

function useAnimatedValueQuery(key: string, defaultValue: number = 0) {
  const loadItem = () => new Animated.Value(defaultValue)

  const { data: value } = useQuery(key, loadItem, {
    suspense: true
  })

  return value as Animated.Value
}

export default useAnimatedValueQuery
