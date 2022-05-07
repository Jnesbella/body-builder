import { ColorSchemeName } from 'react-native'
import { AccentColor, PrimaryColor } from './stylesTypes'

const black = '#000000'
const white = '#ffffff'
const transparent = `${black}00`

const tintColorLight = '#2f95dc'
const tintColorDark = white

const transparencyLight = '33'
const transparencyDark = '99'

export interface MakeCommonColorsOptions {
  primary: PrimaryColor
  accent: AccentColor
}

const makeCommonColors = ({ primary, accent }: MakeCommonColorsOptions) => ({
  primary,
  primaryLight: `${primary}${transparencyLight}`,

  accent,
  accentLight: `${accent}${transparencyLight}`,

  black,
  white,
  transparent,

  textInfo: '#aaaaaa',
  textWarn: '#F1C40F',
  textError: '##CB4335',
  textDisabled: `${black}${transparencyDark}`,

  backgroundInfo: '#dddddd',
  backgroundWarn: '#F9E79F',
  backgroundError: '#F5B7B1',
  backgroundDisabled: `${black}${transparencyLight}`,
  backgroundDivider: '#cccccc',

  tabIconDefault: '#cccccc',

  backdrop: `${black}${transparencyDark}`
})

export interface MakeSchemeColorsOptions extends MakeCommonColorsOptions {
  colorScheme?: ColorSchemeName
}

const colorSchemeColors = {
  light: {
    text: black,
    background: white,

    tint: tintColorLight,
    tabIconSelected: tintColorLight
  },

  dark: {
    text: white,
    background: black,

    tint: tintColorDark,
    tabIconSelected: tintColorDark
  }
}

export const makeSchemeColors = ({
  primary,
  accent,
  colorScheme
}: MakeSchemeColorsOptions) => {
  const commonColors = makeCommonColors({ primary, accent })
  const schemeColors = colorSchemeColors[colorScheme || 'light']

  return {
    ...commonColors,
    ...schemeColors
  }
}
