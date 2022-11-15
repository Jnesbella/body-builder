import * as React from "react";
import {
  Layout,
  Text,
  Surface,
  theme,
  Divider,
  bordered,
  rounded,
  Bordered,
  Rounded,
  utcStringToDate,
  spacing,
  Measure,
  MeasureElement,
} from "@jnesbella/body-builder";
import styled from "styled-components/native";

import { Note } from "../../types";

const NoteDividerLabelWrapper = styled(Surface)<Bordered & Rounded>`
  ${bordered};
  ${rounded({ roundness: theme.spacing * 2.5 })};
  ${spacing({ spacingSize: [1, 0] })};
`;

const NoteDividerDividerWrapper = styled(Layout.Box)<
  Bordered & Rounded & { top: number }
>`
  position: absolute;
  margin-top: ${(props) => props.top}px;
`;

function NoteDivider({ note }: { note: Note }) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date: Date = utcStringToDate(note.createdAt);

  const [measureElement, setMeasureElement] =
    React.useState<MeasureElement | null>(null);

  return (
    <Layout.Column spacingSize={[0, 1.5]}>
      <Measure
        ref={setMeasureElement}
        style={{
          zIndex: theme.zIndex.aboveAll,
        }}
      >
        <Layout.Box fullWidth alignItems="center">
          <NoteDividerLabelWrapper>
            <Text.Label>
              {days[date.getDay()]}, {months[date.getMonth() - 1]}{" "}
              {date.getDate()}
            </Text.Label>
          </NoteDividerLabelWrapper>
        </Layout.Box>
      </Measure>

      <NoteDividerDividerWrapper
        fullWidth
        top={(measureElement?.rect?.height || 0) / 2}
      >
        <Divider />
      </NoteDividerDividerWrapper>
    </Layout.Column>
  );
}

export default NoteDivider;
