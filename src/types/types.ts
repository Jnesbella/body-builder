export type TokenType = "Refresh" | "Bearer";

export interface Authorization {
  tokenType: TokenType;
  accessToken?: string;
  refreshToken?: string;
}

export type PathPart = string | number;

export type PathParts = PathPart | (PathPart | undefined)[];

export type SizeProp = "xsmall" | "small" | "medium" | "large";

export type OrientationProp = "horizontal" | "vertical";

export type DirectionProp = "top" | "right" | "bottom" | "left";
