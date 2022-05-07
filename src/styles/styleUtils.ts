function padZero(str: string, len?: number) {
  len = len || 2
  var zeros = new Array(len).join('0')
  return (zeros + str).slice(-len)
}

export function invertColor(_hex: string, blackAndWhite = true) {
  let hex = _hex.indexOf('#') === 0 ? _hex.slice(1) : _hex

  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }

  if (hex.length !== 6) {
    // throw new Error("Invalid HEX color.");
  }

  let r: string | number = parseInt(hex.slice(0, 2), 16),
    g: string | number = parseInt(hex.slice(2, 4), 16),
    b: string | number = parseInt(hex.slice(4, 6), 16)
  if (blackAndWhite) {
    // https://stackoverflow.com/a/3943023/112731
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF'
  }
  // invert color components
  r = (255 - r).toString(16)
  g = (255 - g).toString(16)
  b = (255 - b).toString(16)
  // pad each with zeros and return
  return '#' + padZero(r) + padZero(g) + padZero(b)
}

export function getContrastColor(hex: string) {
  return invertColor(hex, true)
}
