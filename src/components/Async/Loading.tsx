import * as React from "react";

import Text from "../Text";
import Layout from "../Layout";
import { Greedy } from "../styled-components";

export interface LoadingProps extends Greedy {
  isLoading?: boolean;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

function Loading({
  isLoading = true,
  fallback = null,
  children,
}: LoadingProps) {
  if (isLoading) {
    return fallback;
  }

  return <React.Fragment>{children}</React.Fragment>;
}

export default Loading;
