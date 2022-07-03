import { ColorSchemeName } from "react-native";
import { AccentColor, PrimaryColor } from "./stylesTypes";
import {
  appendTransparency,
  appendDarkTransparency,
  appendLightTransparency,
} from "./styleUtils";

const black = "#000000";
const white = "#ffffff";

const tintColorLight = "#2f95dc";
const tintColorDark = white;

export interface MakeCommonColorsOptions {
  primary: PrimaryColor;
  accent: AccentColor;
}

const makeCommonColors = ({ primary, accent }: MakeCommonColorsOptions) => ({
  primary,
  primaryLight: appendLightTransparency(primary),

  accent,
  accentLight: appendLightTransparency(accent),

  black,
  white,

  textInfo: "#aaaaaa",
  textWarn: "#F1C40F",
  textError: "##CB4335",
  textDisabled: appendDarkTransparency(black),
  textCode: "red",

  backgroundInfo: "#dddddd",
  backgroundWarn: "#F9E79F",
  backgroundError: "#F5B7B1",
  backgroundDisabled: appendLightTransparency(black),
  backgroundDivider: "#cccccc",

  tabIconDefault: "#cccccc",

  backdrop: appendDarkTransparency(black),
});

export interface MakeSchemeColorsOptions extends MakeCommonColorsOptions {
  colorScheme?: ColorSchemeName;
}

const colorSchemeColors = {
  light: {
    text: black,
    background: white,
    transparent: appendTransparency(white, "00"),

    tint: tintColorLight,
    tabIconSelected: tintColorLight,
  },

  dark: {
    text: white,
    background: black,
    transparent: appendTransparency(black, "00"),

    tint: tintColorDark,
    tabIconSelected: tintColorDark,
  },
};

export const makeSchemeColors = ({
  primary,
  accent,
  colorScheme,
}: MakeSchemeColorsOptions) => {
  const commonColors = makeCommonColors({ primary, accent });
  const schemeColors = colorSchemeColors[colorScheme || "light"];

  return {
    ...commonColors,
    ...schemeColors,
  };
};
