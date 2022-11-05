import * as React from "react";
import Loading from "./Loading";

export interface AsyncSuspenseProps
  extends Omit<React.SuspenseProps, "fallback"> {
  onLoadingComplete?: () => void;
  fallback?: NonNullable<React.ReactNode> | null;
}

function AsyncSuspense({
  fallback,
  children,
  onLoadingComplete,
}: AsyncSuspenseProps) {
  return (
    <React.Suspense
      fallback={
        <Loading fallback={fallback} onLoadingComplete={onLoadingComplete} />
      }
    >
      {children}
    </React.Suspense>
  );
}

export default AsyncSuspense;
