import * as React from "react";
import Loading from "./Loading";

export interface AsyncSuspenseProps extends React.SuspenseProps {}

function AsyncSuspense({
  fallback = <Loading />,
  children,
}: AsyncSuspenseProps) {
  return <React.Suspense fallback={fallback}>{children}</React.Suspense>;
}

export default AsyncSuspense;
