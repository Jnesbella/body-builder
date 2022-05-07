import * as React from 'react'

import Text from '../Text'
import Layout from '../Layout'
import { Greedy } from '../styled-components'

export interface LoadingProps extends Greedy {
  isLoading?: boolean
}

function Loading({ isLoading = true, ...rest }: LoadingProps) {
  if (isLoading) {
    return null
  }

  return (
    <Layout.Box {...rest}>
      <Text>Loading...</Text>
    </Layout.Box>
  )
}

export default Loading
