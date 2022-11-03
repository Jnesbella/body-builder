import * as React from "react";
import { Animated, Easing } from "react-native";
import styled from "styled-components/native";

import { useSetRef } from "../../hooks";
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
}

const FadeIn = React.forwardRef<FadeInElement, FadeInProps>(
  ({ children, duration = 100, ...rest }, ref) => {
    const { current: fadeAnim } = React.useRef(new Animated.Value(0));

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

    const fadeIn = () => {
      fadeInTiming.start();

      return fadeInTiming;
    };

    const fadeOut = () => {
      fadeOutTiming.start();

      return fadeOutTiming;
    };

    useSetRef(ref, { fadeIn, fadeOut });

    React.useEffect(function handleOnMound() {
      const timing = fadeIn();

      return () => {
        timing.stop();
      };
    }, []);

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
