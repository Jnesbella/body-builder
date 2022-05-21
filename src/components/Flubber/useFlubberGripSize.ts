import { theme } from "../../styles";
import { SizeProp } from "../../types";

import { FlubberGripProps } from "./FlubberGrip";

const sizeToPixels: Record<SizeProp, number> = {
  xsmall: theme.spacing * 0.5,
  small: theme.spacing * 1,
  medium: theme.spacing * 2.5,
  large: theme.spacing * 3,
};

function useFlubberGripSize(size: FlubberGripProps["size"] = "small") {
  const gripSize = sizeToPixels[size];

  return gripSize;
}

export default useFlubberGripSize;
