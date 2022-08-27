import * as React from "react";
import {
  ScrollView as DefaultScrollView,
  ScrollViewProps as DefaultScrollViewProps,
  NativeScrollEvent,
} from "react-native";

import ScrollViewProvider, {
  ScrollViewProviderElement,
} from "./ScrollViewProvider";

type ScrollViewRenderChildrenCallback = (
  props: ScrollViewProviderElement
) => JSX.Element;

export interface ScrollViewProps
  extends Omit<DefaultScrollViewProps, "children"> {
  children?: React.ReactNode | ScrollViewRenderChildrenCallback;
}

const ScrollView = React.forwardRef<DefaultScrollView, ScrollViewProps>(
  ({ onScroll, children, scrollEventThrottle = 16, ...rest }, ref) => {
    const [nativeEvent, setNativeEvent] = React.useState<NativeScrollEvent>();

    const renderChildren = () =>
      typeof children === "function"
        ? (children as ScrollViewRenderChildrenCallback)({
            ...nativeEvent,
          })
        : children;

    return (
      <ScrollViewProvider state={nativeEvent}>
        <DefaultScrollView
          {...rest}
          scrollEventThrottle={scrollEventThrottle}
          // scrollEventThrottle={100}
          ref={ref}
          onScroll={(event) => {
            onScroll?.(event);

            setNativeEvent(event.nativeEvent);
          }}
        >
          {renderChildren()}
        </DefaultScrollView>
      </ScrollViewProvider>
    );
  }
);

export default ScrollView;
