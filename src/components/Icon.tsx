// https://fontawesome.com/icons

import * as React from 'react'
import { FontAwesomeIcon as FontAwesomeReact } from '@fortawesome/react-fontawesome'
import { FontAwesomeIcon as FontAwesomeNative } from '@fortawesome/react-native-fontawesome'
import styled from 'styled-components/native'

import { theme } from '../styles'
import { log } from '../utils'

import { color, Background, background, Color } from './styled-components'

const StyledIconNative = styled(FontAwesomeNative)<Background & Color>`
  ${color};
  ${background};
`

export type IconProps = React.ComponentProps<typeof FontAwesomeNative> &
  Background

function Icon({ size = theme.spacing * 2.5, color, icon }: IconProps) {
  const props = { icon, color }

  return <StyledIconNative {...props} size={size} />
}

export default Icon
