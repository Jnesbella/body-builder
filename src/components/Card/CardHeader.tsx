import * as React from 'react'

import { AlignItems, JustifyContent } from '../styled-components'
import Layout from '../Layout'
import Text from '../Text'

export interface CardProps {
  title?: React.ReactNode
  label?: React.ReactNode
  children?: React.ReactNode
  right?: React.ReactNode
}

function CardHeader({ title, label, children, right }: CardProps) {
  return (
    <Layout.Column fullWidth size={1}>
      <Layout.Column>
        <Layout.Row
          justifyContent={JustifyContent.SpaceBetween}
          alignItems={AlignItems.Center}
        >
          <Text.Title>{title || '|'}</Text.Title>

          {right}
        </Layout.Row>
        <Text.Label>{label || '|'}</Text.Label>
      </Layout.Column>

      {children}
    </Layout.Column>
  )
}

export default CardHeader
