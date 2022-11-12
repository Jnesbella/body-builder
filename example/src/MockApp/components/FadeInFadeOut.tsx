import * as React from "react";
import {
  Layout,
  Surface,
  Effect,
  FadeInElement,
  theme,
} from "@jnesbella/body-builder";

export interface FadeInFadeOutProps {
  enabled?: boolean;
  onFadedOut?: () => void;
  duration?: number;
  delay?: number;
}

function FadeInFadeOut({
  enabled = true,
  onFadedOut,
  duration,
  delay,
}: FadeInFadeOutProps) {
  const ref = React.useRef<FadeInElement>(null);

  return (
    <Effect.FadeIn
      greedy
      ref={ref}
      duration={duration}
      delay={delay}
      onFadeInComplete={() => {
        ref.current?.fadeOut();
      }}
      onFadeOutComplete={() => {
        if (enabled) {
          ref.current?.fadeIn();
        } else {
          onFadedOut?.();
        }
      }}
    >
      <Layout.Box spacingSize={1} greedy>
        <Surface greedy background={theme.colors.primaryLight} />
      </Layout.Box>
    </Effect.FadeIn>
  );
}

export default FadeInFadeOut;
