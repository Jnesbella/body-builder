import * as React from "react";
import { Animated, Easing } from "react-native";
import styled from "styled-components/native";

import {
  useOnValueChange,
  useSetRef,
  useWatchAnimatedValue,
} from "../../hooks";
import { Greedy, greedy } from "../styled-components";
import Util from "../Util";

const FadeInContainer = styled(Animated.View)<{ visible?: boolean } & Greedy>`
  ${greedy};

  pointer-events: ${(props) => (props.visible ? "auto" : "none")};
`;

export interface FadeInElement {
  fadeOut: () => void;
  fadeIn: () => void;
}

export interface FadeInProps extends Greedy {
  children?: React.ReactNode;
  duration?: number;
  delay?: number;
  onFadeInStart?: () => void;
  onFadeInComplete?: (options: { finished: boolean }) => void;
  onFadeOutStart?: () => void;
  onFadeOutComplete?: (options: { finished: boolean }) => void;
  value?: Animated.Value;
  fadeIn?: boolean;
  fadeOut?: boolean;
  fadeInOnMount?: boolean;
}

const FadeIn = React.forwardRef<FadeInElement, FadeInProps>(
  (
    {
      children,
      duration = 200,
      delay = 0,
      onFadeInStart,
      onFadeInComplete,
      onFadeOutStart,
      onFadeOutComplete,
      value,
      fadeIn: isFadeIn = true,
      fadeOut: isFadeOut,
      fadeInOnMount = true,
      ...rest
    },
    ref
  ) => {
    const { current: fadeAnim } = React.useRef(value || new Animated.Value(0));
    const [isMounted, setIsMounted] = React.useState(false);

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
      onFadeInStart?.();

      return fadeInTiming;
    };

    const fadeOut = () => {
      Animated.sequence([Animated.delay(delay), fadeOutTiming]).start(
        onFadeOutComplete
      );
      onFadeOutStart?.();

      return fadeOutTiming;
    };

    useSetRef(ref, { fadeIn, fadeOut });

    React.useEffect(
      function handleFade() {
        const shouldFadeIn = (fadeInOnMount && !isMounted) || isFadeIn;

        const timing = shouldFadeIn ? fadeIn() : fadeOut();

        return () => {
          timing.stop();
        };
      },
      [isFadeIn, fadeInOnMount, isMounted]
    );

    const opacityValue = useWatchAnimatedValue(fadeAnim) || 0;
    const isVisible = opacityValue > 0;

    return (
      <Util.Mount onMount={() => setIsMounted(true)}>
        <FadeInContainer
          style={{
            opacity: fadeAnim,
          }}
          visible={isVisible}
          {...rest}
        >
          {children}
        </FadeInContainer>
      </Util.Mount>
    );
  }
);

export default FadeIn;
