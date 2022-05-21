import * as React from "react";

import {
  useWatchAnimatedValue,
  useIsMounted,
  useAnimation,
  UseAnimation,
} from "../../hooks";
import { AnimatedValueQuery, useAnimatedValue } from "../../AnimatedValue";

import usePushAndPull from "./usePushAndPull";
import Flubber, { FlubberProps } from "./Flubber";
import FlubberGrip, { FlubberGripProps } from "./FlubberGrip";
import { isNumber } from "lodash";

const SLIDE_WIDTH = 300;

export interface FlubberSlideElement {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export interface FlubberSlideProps
  extends Pick<UseAnimation, "duration" | "enabled">,
    FlubberProps {
  children?: React.ReactNode;
  defaultIsOpen?: boolean;
  gripPlacement?: "before" | "after";
  gripTo?: AnimatedValueQuery;
  onToggle?: (isOpen: boolean) => void;
}

const FlubberSlide = React.forwardRef<FlubberSlideElement, FlubberSlideProps>(
  (
    {
      children,
      duration,
      enabled = true,
      defaultIsOpen,
      gripPlacement,
      width,
      height,
      gripTo,
      defaultWidth: _defaultWidth = SLIDE_WIDTH,
      onToggle,
      greedy,
    },
    ref
  ) => {
    // const isMounted = useIsMounted();
    const defaultWidth = defaultIsOpen ? _defaultWidth : 0;
    const defaultValue = useAnimatedValue(width, defaultWidth);
    const widthInPixels = useWatchAnimatedValue(defaultValue, defaultWidth);
    const isOpen = isNumber(widthInPixels) && widthInPixels > 0;

    // const [isVisible, setIsVisible] = React.useState(isOpen);

    const widthInPixelsRef = React.useRef<number | undefined>(widthInPixels);

    const slideToValue = isOpen ? 0 : widthInPixelsRef.current || defaultWidth;
    const {
      value: slide,
      start: startSlide,
      isAnimating,
    } = useAnimation({
      defaultValue,
      duration,
      enabled,
      toValue: slideToValue,
    });

    const target = useAnimatedValue(gripTo);
    usePushAndPull({
      enabled: gripTo && isAnimating,
      target,
      source: slide,
    });

    const isGripBefore = gripPlacement === "before";
    const isGripAfter = gripPlacement === "after";

    const open = () => {
      if (!isOpen && !isAnimating) {
        startSlide();
      }
    };

    const close = () => {
      if (isOpen && !isAnimating) {
        widthInPixelsRef.current = widthInPixels;

        startSlide();
      }
    };

    const toggle = () => {
      if (isOpen) {
        close();
      } else {
        open();
      }
    };

    React.useEffect(() => {
      const element: FlubberSlideElement = {
        open,
        close,
        toggle,
      };

      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    });

    React.useEffect(
      function handleToggle() {
        onToggle?.(isOpen);
      },
      [isOpen, onToggle]
    );

    // React.useEffect(
    //   function handleIsOpenChange() {
    //     if (isMounted) {
    //       setIsVisible(isOpen);
    //     }
    //   },
    //   [isMounted, isOpen]
    // );

    // if (!isVisible) {
    //   return null
    // }

    const gripProps: Pick<
      FlubberGripProps,
      "orientation" | "enabled" | "size"
    > = {
      enabled: !isAnimating,
      orientation: "vertical",
    };

    return (
      <React.Fragment>
        {isGripBefore && gripTo && (
          <FlubberGrip {...gripProps} pushAndPull={[gripTo, width]} />
        )}

        <Flubber
          width={width}
          height={height}
          defaultWidth={defaultWidth}
          greedy={greedy}
        >
          {children}
        </Flubber>

        {isGripAfter && gripTo && (
          <FlubberGrip {...gripProps} pushAndPull={[width, gripTo]} />
        )}
      </React.Fragment>
    );
  }
);

export default FlubberSlide;
