export type TokenType = "Refresh" | "Bearer";

export interface Authorization {
  tokenType: TokenType;
  accessToken: string;
  refreshToken?: string;
}

export type PathParts = string | (string | number | undefined)[];

export type SizeProp = "xsmall" | "small" | "medium" | "large";

export type OrientationProp = "horizontal" | "vertical";

export type DirectionProp = "top" | "right" | "bottom" | "left";
