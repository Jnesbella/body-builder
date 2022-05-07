import * as React from "react";

import { useWatchAnimatedValue } from "../../hooks";
import { useIsMounted } from "../../hooks";
import usePushAndPull from "./usePushAndPull";

import { AnimatedValueQuery, useAnimatedValue } from "../../AnimatedValue";
import Flubber, { FlubberProps, FlubberGripProps } from ".";

import useAnimation, { UseAnimation } from "../Effect/useAnimation";

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
  gripTo: AnimatedValueQuery;
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
      defaultWidth = SLIDE_WIDTH,
      onToggle,
    },
    ref
  ) => {
    const isMounted = useIsMounted();
    const initialWidth = defaultIsOpen ? defaultWidth : 0;
    const defaultValue = useAnimatedValue(width, initialWidth);
    const widthInPixels = useWatchAnimatedValue(defaultValue, initialWidth);
    const isOpen = widthInPixels > 0;
    const [isVisible, setIsVisible] = React.useState(isOpen);
    const widthInPixelsRef = React.useRef<number>(widthInPixels);
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
      enabled: isAnimating,
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

    React.useEffect(
      function handleIsOpenChange() {
        if (isMounted) {
          setIsVisible(isOpen);
        }
      },
      [isMounted, isOpen]
    );

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
        {isGripBefore && (
          <Flubber.Grip {...gripProps} pushAndPull={[gripTo, width]} />
        )}

        <Flubber width={width} height={height} defaultWidth={initialWidth}>
          {children}
        </Flubber>

        {isGripAfter && (
          <Flubber.Grip {...gripProps} pushAndPull={[width, gripTo]} />
        )}
      </React.Fragment>
    );
  }
);

export default FlubberSlide;
