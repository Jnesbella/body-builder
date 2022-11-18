import * as React from "react";
import { Animated, Easing } from "react-native";
import styled from "styled-components/native";

import { useOnValueChange, useSetRef } from "../../hooks";
import { Greedy, greedy } from "../styled-components";

const FadeInContainer = styled(Animated.View)`
  ${greedy};
`;

export interface FadeInElement {
  fadeOut: () => void;
  fadeIn: () => void;
}

export interface FadeInProps extends Greedy {
  children?: React.ReactNode;
  duration?: number;
  delay?: number;
  onFadeInComplete?: (options: { finished: boolean }) => void;
  onFadeOutComplete?: (options: { finished: boolean }) => void;
  value?: Animated.Value;
  fadeIn?: boolean;
  fadeOut?: boolean;
}

const FadeIn = React.forwardRef<FadeInElement, FadeInProps>(
  (
    {
      children,
      duration = 600,
      delay = 0,
      onFadeInComplete,
      onFadeOutComplete,
      value,
      fadeIn: isFadeIn = true,
      fadeOut: isFadeOut,
      ...rest
    },
    ref
  ) => {
    const { current: fadeAnim } = React.useRef(value || new Animated.Value(0));

    const { fadeInTiming, fadeOutTiming } = React.useMemo(() => {
      const timingOptions = {
        duration,
        easing: Easing.ease,
        useNativeDriver: false,
      };

      const fadeInTiming = Animated.timing(fadeAnim, {
        ...timingOptions,
        toValue: 1,
      });

      const fadeOutTiming = Animated.timing(fadeAnim, {
        ...timingOptions,
        toValue: 0,
      });

      return { fadeInTiming, fadeOutTiming };
    }, [duration]);

    const fadeIn = () => {
      Animated.sequence([Animated.delay(delay), fadeInTiming]).start(
        onFadeInComplete
      );

      return fadeInTiming;
    };

    const fadeOut = () => {
      Animated.sequence([Animated.delay(delay), fadeOutTiming]).start(
        onFadeOutComplete
      );

      return fadeOutTiming;
    };

    useSetRef(ref, { fadeIn, fadeOut });

    React.useEffect(function handleOnMount() {
      const timing = fadeIn();

      return () => {
        timing.stop();
      };
    }, []);

    useOnValueChange(isFadeIn, () => {
      if (isFadeIn) {
        const timing = fadeIn();

        return () => {
          timing.stop();
        };
      }
    });

    useOnValueChange(isFadeOut, () => {
      if (isFadeOut) {
        const timing = fadeOut();

        return () => {
          timing.stop();
        };
      }
    });

    return (
      <FadeInContainer
        style={{
          opacity: fadeAnim,
        }}
        {...rest}
      >
        {children}
      </FadeInContainer>
    );
  }
);

export default FadeIn;
