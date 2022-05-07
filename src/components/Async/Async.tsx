import * as React from 'react'
import { UseQueryResult } from 'react-query'

import ErrorMessage from '../ErrorMessage'

import Loading from './Loading'
import Shimmer from './Shimmer'

export type AsyncProps<P = any> = Omit<UseQueryResult<P, null>, 'data'> & {
  data?: P
  children?: ((props: { data?: P }) => React.ReactNode) | React.ReactNode
}

function Async<P = any>({ isLoading, isError, data, children }: AsyncProps<P>) {
  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <ErrorMessage />
  }

  if (typeof children === 'function') {
    return children({ data })
  }

  return children ? children : <React.Fragment />
}

Async.Loading = Loading
Async.Shimmer = Shimmer

export default Async
