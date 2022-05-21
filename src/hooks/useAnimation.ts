import * as React from "react";
import { Animated, Easing } from "react-native";

export interface UseAnimation {
  defaultValue?: Animated.Value;
  toValue: number;
  duration?: number;
  enabled?: boolean;
}

function useAnimation({
  toValue,
  duration = 100,
  enabled = true,
  defaultValue: animatedValue = new Animated.Value(0),
}: UseAnimation) {
  const toValueRef = React.useRef(toValue);

  const [isAnimating, setIsAnimating] = React.useState(false);
  const timingRef = React.useRef<Animated.CompositeAnimation>();

  const start = React.useCallback(
    (onFinished?: () => void) => {
      if (enabled) {
        const timing = Animated.timing(animatedValue, {
          toValue,
          duration,
          easing: Easing.ease,
          useNativeDriver: false,
        });

        timingRef.current = timing;
        toValueRef.current = toValue;
        setIsAnimating(true);

        timing.start(() => {
          setIsAnimating(false);
          onFinished?.();
        });
      }
    },
    [enabled, duration, toValue]
  );

  const stop = React.useCallback(() => {
    timingRef.current?.stop();
  }, []);

  return {
    value: animatedValue,
    isAnimating,
    toValue: toValueRef.current,

    start,
    stop,
  };
}

export default useAnimation;
