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
} from "@jnesbella/body-builder";
import styled from "styled-components/native";

import { Note } from "../../types";

const NoteDividerLabelWrapper = styled(Surface)<Bordered & Rounded>`
  ${bordered};
  ${rounded({ roundness: theme.spacing * 2.5 })};
  ${spacing({ spacingSize: [1, 0] })};
`;

const NoteDividerDividerWrapper = styled(Layout.Box)<Bordered & Rounded>`
  position: absolute;
  margin-top: ${theme.spacing * 2.5}px;
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

  return (
    <Layout.Column spacingSize={[0, 1]}>
      <Layout.Box
        fullWidth
        alignItems="center"
        style={{
          zIndex: theme.zIndex.aboveAll,
        }}
      >
        <NoteDividerLabelWrapper>
          <Text.SubHeader>
            {days[date.getDay()]}, {months[date.getMonth() - 1]}{" "}
            {date.getDate()}
          </Text.SubHeader>
        </NoteDividerLabelWrapper>
      </Layout.Box>

      <NoteDividerDividerWrapper fullWidth>
        <Divider />
      </NoteDividerDividerWrapper>
    </Layout.Column>
  );
}

export default NoteDivider;
