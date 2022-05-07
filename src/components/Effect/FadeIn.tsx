import * as React from 'react'
import { Animated, Easing } from 'react-native'
import styled from 'styled-components/native'

import { Greedy, greedy } from '../styled-components'

const FadeInContainer = styled(Animated.View)`
  ${greedy};
`

export interface FadeInProps extends Greedy {
  children?: React.ReactNode
  duration?: number
}

function FadeIn({ children, duration = 100, ...rest }: FadeInProps) {
  const { current: fadeAnim } = React.useRef(new Animated.Value(0))

  React.useEffect(() => {
    const timing = Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      easing: Easing.ease,
      useNativeDriver: false
    })

    timing.start()

    return () => {
      timing.stop()
    }
  }, [fadeAnim, duration])

  return (
    <FadeInContainer
      style={{
        opacity: fadeAnim
      }}
      {...rest}
    >
      {children}
    </FadeInContainer>
  )
}

export default FadeIn
