import { ColorSchemeName } from 'react-native'

export type PrimaryColor = string
export type AccentColor = string

export interface Colors {}

export interface ThemeColors {}

export interface Theme {
  roundness: number
  spacing: number
  borderThickness: number

  colors: Record<string, string>
}

export interface ThemeOptions {
  primary: PrimaryColor
  accent: AccentColor
  colorScheme?: ColorSchemeName

  roundness?: number
  spacing?: number
  borderThickness?: number
}

export type ColorProp = 'primary' | 'accent'
