import {
  TRANSPARENCY_DARK_AMT,
  TRANSPARENCY_LIGHT_AMT,
} from "./stylesConstants";
import theme from "./theme";

function padZero(str: string, len?: number) {
  len = len || 2;
  var zeros = new Array(len).join("0");
  return (zeros + str).slice(-len);
}

export function invertColor(_hex: string, blackAndWhite = true) {
  let hex = _hex.indexOf("#") === 0 ? _hex.slice(1) : _hex;

  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  if (hex.length !== 6) {
    // throw new Error("Invalid HEX color.");
  }

  let r: string | number = parseInt(hex.slice(0, 2), 16),
    g: string | number = parseInt(hex.slice(2, 4), 16),
    b: string | number = parseInt(hex.slice(4, 6), 16);
  if (blackAndWhite) {
    // https://stackoverflow.com/a/3943023/112731
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#FFFFFF";
  }
  // invert color components
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  // pad each with zeros and return
  return "#" + padZero(r) + padZero(g) + padZero(b);
}

export function getContrastColor(hex: string) {
  return invertColor(hex, true);
}

function lightenOrDarkenColor(color: string, percent: number) {
  var num = parseInt(color.replace("#", ""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = ((num >> 8) & 0x00ff) + amt,
    G = (num & 0x0000ff) + amt;

  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
      (G < 255 ? (G < 1 ? 0 : G) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

export const lightColor = (color: string, percent: number) =>
  lightenOrDarkenColor(color, percent);

export const darkenColor = (color: string, percent: number) =>
  lightenOrDarkenColor(color, -percent);

export const appendTransparency = (
  color: string,
  transparency: number | string
) => `${color}${transparency}`;

export const appendLightTransparency = (color: string) =>
  appendTransparency(color, TRANSPARENCY_LIGHT_AMT);

export const appendDarkTransparency = (color: string) =>
  appendTransparency(color, TRANSPARENCY_DARK_AMT);

export const isColorTransparent = (color: string) =>
  color === theme.colors.transparent;
