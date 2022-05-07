import * as React from 'react'
import styled from 'styled-components/native'

import { theme } from '../styles'

import Icon, { IconProps } from './Icon'
import DefaultButton, { ButtonProps } from './Button'

export const ICON_BUTTON_SIZE = theme.spacing * 4.5

const Button = styled(DefaultButton).attrs({ roundness: ICON_BUTTON_SIZE })`
  padding: 0;
  width: ${ICON_BUTTON_SIZE}px;
  height: ${ICON_BUTTON_SIZE}px;
  align-items: center;
`

export interface IconButtonProps extends ButtonProps {
  icon: IconProps['icon']
  background?: string
}

function IconButton({ icon, background, ...rest }: IconButtonProps) {
  return (
    <Button {...rest} background={background}>
      {({ color }) => <Icon icon={icon} color={color} />}
    </Button>
  )
}

export default IconButton
