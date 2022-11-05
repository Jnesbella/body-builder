import * as React from "react";

import Text from "../Text";
import Layout from "../Layout";
import { Greedy } from "../styled-components";
import Util from "../Util";

export interface LoadingProps {
  isLoading?: boolean;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
  onLoadingComplete?: () => void;
}

function Loading({
  isLoading = true,
  fallback = null,
  children,
  onLoadingComplete,
}: LoadingProps) {
  return (
    <Util.Mount onUnmount={onLoadingComplete}>
      {isLoading ? fallback : children}
    </Util.Mount>
  );
}

export default Loading;
