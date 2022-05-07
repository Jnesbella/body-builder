import { makeSchemeColors } from './colors'
import { ThemeOptions } from './stylesTypes'
import { zIndex } from './zIndex'

const makeTheme = ({
  primary,
  accent,
  colorScheme = 'light',

  roundness = 2,
  spacing = 8,
  borderThickness = 2
}: ThemeOptions) => ({
  roundness,
  spacing,
  borderThickness,

  colors: makeSchemeColors({ primary, accent, colorScheme }),

  zIndex
})

// const theme = makeTheme({ primary: '#8a2be2', accent: '#48d1cc' })
const theme = makeTheme({ primary: '#1675d1', accent: '#efc33b' })

export default theme
