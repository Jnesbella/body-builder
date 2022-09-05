import * as React from "react";

function useForceUpdate() {
  const [_count, setCount] = React.useState(0);

  const forceUpdate = React.useCallback(() => {
    setCount((count) => count + 1);
  }, []);

  return forceUpdate;
}

export default useForceUpdate;
