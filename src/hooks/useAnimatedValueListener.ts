import { noop } from "lodash";
import * as React from "react";
import { Animated } from "react-native";

function useAnimatedValueListener(
  animatedValue?: Animated.Value,
  callback: Animated.ValueListenerCallback = noop
) {
  React.useEffect(
    function handleValueChange() {
      const listenerId = animatedValue?.addListener(callback);

      return () => {
        if (listenerId) {
          animatedValue?.removeListener(listenerId);
        }
      };
    },
    [animatedValue, callback]
  );
}

export default useAnimatedValueListener;
