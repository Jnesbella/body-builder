import * as React from "react";
import { Async, Util, Effect } from "@jnesbella/body-builder";

import FadeInFadeOut from "./FadeInFadeOut";

export interface PleasantLoadingProps {
  children?: React.ReactNode;
  mockLoadingTimeout?: number;
}

function PleasantLoading({
  children,
  mockLoadingTimeout = 2000,
}: PleasantLoadingProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [_isFadedOut, setIsFadedOut] = React.useState(false);

  const isFadedOut = _isFadedOut || !mockLoadingTimeout;

  return (
    <React.Fragment>
      {!isFadedOut && !!mockLoadingTimeout && (
        <FadeInFadeOut
          duration={600}
          delay={300}
          enabled={!isLoaded && !!mockLoadingTimeout}
          onFadedOut={() => setIsFadedOut(true)}
        />
      )}

      <Async.Suspense onLoadingComplete={() => setIsLoaded(true)}>
        <Util.Suspend timeout={mockLoadingTimeout} />

        {isLoaded && isFadedOut && (
          <Effect.FadeIn greedy>{children}</Effect.FadeIn>
        )}
      </Async.Suspense>
    </React.Fragment>
  );
}

export default PleasantLoading;
