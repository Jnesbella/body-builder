import * as React from "react";
import { ScrollView } from "react-native";
import { useSetRef } from "../../hooks";

export interface WorksheetScrollViewProps {
  children?: React.ReactNode;
  stickyHeaderIndices?: number[];
}

const style = { minWidth: "100%", minHeight: "100%" };

export interface WorksheetScrollViewElement {
  scrollToEnd: (options?: { animated?: boolean }) => void;
}

const WorksheetScrollView = React.forwardRef<
  WorksheetScrollViewElement,
  WorksheetScrollViewProps
>(({ children, stickyHeaderIndices }, ref) => {
  const innerScrollRef = React.useRef<ScrollView>(null);

  const element: WorksheetScrollViewElement = {
    scrollToEnd: ({ animated = false } = {}) => {
      innerScrollRef.current?.scrollToEnd({ animated });
    },
  };

  useSetRef(ref, element);

  // React.useEffect(() => {
  //   if (typeof ref === "function") {
  //     ref(element);
  //   } else if (ref) {
  //     ref.current = element;
  //   }
  // });

  return (
    <ScrollView horizontal contentContainerStyle={style}>
      <ScrollView
        ref={innerScrollRef}
        contentContainerStyle={style}
        stickyHeaderIndices={stickyHeaderIndices}
      >
        {children}
      </ScrollView>
    </ScrollView>
  );
});

export default WorksheetScrollView;
