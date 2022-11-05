import * as React from "react";

export interface MountProps {
  children?: React.ReactNode;
  onMount?: () => void;
  onUnmount?: () => void;
}

function Mount({ children, onMount, onUnmount }: MountProps) {
  React.useEffect(() => {
    onMount?.();

    return () => {
      onUnmount?.();
    };
  }, []);

  return <React.Fragment>{children}</React.Fragment>;
}

export default Mount;
