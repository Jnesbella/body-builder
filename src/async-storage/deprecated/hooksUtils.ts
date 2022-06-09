import { compact } from "lodash";

export const makeKey = (keyParts: (string | undefined)[], separator = "") =>
  compact(keyParts).join(separator);
