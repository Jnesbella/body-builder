import * as React from 'react'

import Layout from '../Layout'
import { Divider, Info, JustifyContent, AlignItems } from '../styled-components'

import { theme } from '../../styles'

export interface ClazzCardProps {
  left?: React.ReactNode
  right?: React.ReactNode
}

function CardSubHeader({ left, right }: ClazzCardProps) {
  return (
    <Layout.Row>
      <Divider background={theme.colors.background} vertical />

      <Info roundness={0} greedy>
        <Layout.Row
          justifyContent={JustifyContent.SpaceBetween}
          alignItems={AlignItems.Center}
        >
          {left || <Layout.Box />}

          {right || <Layout.Box />}
        </Layout.Row>
      </Info>

      <Divider background={theme.colors.background} vertical />
    </Layout.Row>
  )
}

export default CardSubHeader
