import * as React from "react";
import { v4 as uuidv4 } from "uuid";

function useId(id?: string): string {
  const defaultId = React.useRef(uuidv4());

  return id || defaultId.current;
}

export default useId;
