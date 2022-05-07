import * as React from 'react'
import { theme } from '../../styles'

import Layout from '../Layout'

export enum ShapeSize {
  XSmall = theme.spacing * 8,
  Small = theme.spacing * 10,
  Medium = theme.spacing * 15,
  Large = theme.spacing * 20,
  XLarge = theme.spacing * 25
}

export interface SquareProps {
  children?: React.ReactNode
  width?: number
  height?: number
  size?: ShapeSize
}

function Square({
  children,
  width: widthProp,
  height: heightProp,
  size
}: SquareProps) {
  const { width, height } = React.useMemo(() => {
    if (size) {
      return {
        width: size,
        height: size
      }
    }

    if (!widthProp && !heightProp) {
      return {
        width: ShapeSize.Medium,
        height: ShapeSize.Medium
      }
    }

    return {
      width: widthProp || heightProp,
      height: heightProp || widthProp
    }
  }, [widthProp, heightProp, size])

  return (
    <Layout.Box
      style={{
        width,
        height
      }}
    >
      {children}
    </Layout.Box>
  )
}

export default Square
