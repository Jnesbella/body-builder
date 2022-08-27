import React from "react";
import { setRef } from "../utils";

function useSetRef(
  ref: React.ForwardedRef<any> | React.MutableRefObject<any>,
  node: any | null
) {
  React.useEffect(function handleRef() {
    setRef(ref, node);
  });
}

export default useSetRef;
