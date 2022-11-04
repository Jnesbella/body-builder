import * as React from "react";

function ThrowError() {
  React.useEffect(function throwError() {
    throw new Error("This is an error");
  });

  return null;
}

export default ThrowError;
